// Jaguh Mat — suara soalan (Gemini TTS) dengan cache dalam Storage "tts"
import { createClient } from "npm:@supabase/supabase-js@2";
import { Mp3Encoder } from "npm:@breezystack/lamejs@1.2.7";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const sb = createClient(SB_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const CLOUD_KEY = Deno.env.get("GOOGLE_TTS_KEY") ?? ""; // kunci Google Cloud (Text-to-Speech API) — guna kredit Cloud
const VERTEX_KEY = Deno.env.get("VERTEX_KEY") ?? ""; // kunci Agent Platform (Vertex) terikat service account
const VERTEX_URL = "https://aiplatform.googleapis.com/v1/projects/project-16ecc47f-1e87-4b6f-ad2/locations/global/publishers/google/models/";
const MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
const VOICES: Record<string, string> = { f: "Kore", m: "Achird" }; // cikgu perempuan / cikgu lelaki
const VER = "v3"; // tukar untuk buang cache lama
const LANGCODE: Record<string, string> = { ms: "ms-MY", en: "en-GB" };
const STYLE: Record<string, string> = {
  ms: "Baca dengan suara cikgu sekolah rendah Malaysia yang mesra dan jelas, dalam Bahasa Melayu Malaysia standard (bukan Bahasa Indonesia), dengan rentak agak laju dan bertenaga seperti cikgu yang bersemangat (jangan perlahan), dan sebut nombor dengan lancar:",
  en: "Say in standard British English, like a friendly primary school teacher, at a brisk, lively pace (not slow):",
};
const FEM = ["Sulafat", "Kore", "Aoede", "Leda", "Despina", "Achernar", "Callirrhoe", "Autonoe", "Erinome", "Vindemiatrix", "Laomedeia"];
const STYLE_F: Record<string, string> = {
  ms: "Cakap dengan laju dan lancar seperti perbualan harian biasa (jangan perlahan, jangan berhenti-henti, sebut nombor panjang dalam satu nafas). Suara cikgu perempuan sekolah rendah Malaysia yang lembut dan mesra, dalam Bahasa Melayu Malaysia standard (bukan Bahasa Indonesia):",
  en: "Speak quickly and fluently like normal everyday conversation (not slow, no pauses, say long numbers in one breath). Voice of a gentle, warm female primary school teacher, standard British English:",
};
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

async function sha(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function wav(pcm: Uint8Array, rate = 24000) {
  const h = new DataView(new ArrayBuffer(44));
  const w = (o: number, t: string) => [...t].forEach((c, i) => h.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); h.setUint32(4, 36 + pcm.length, true); w(8, "WAVE"); w(12, "fmt ");
  h.setUint32(16, 16, true); h.setUint16(20, 1, true); h.setUint16(22, 1, true);
  h.setUint32(24, rate, true); h.setUint32(28, rate * 2, true); h.setUint16(32, 2, true); h.setUint16(34, 16, true);
  w(36, "data"); h.setUint32(40, pcm.length, true);
  const out = new Uint8Array(44 + pcm.length); out.set(new Uint8Array(h.buffer), 0); out.set(pcm, 44); return out;
}
async function synth(body: unknown) {
  const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": CLOUD_KEY },
    body: JSON.stringify(body),
  });
  if (!r.ok) return { err: `${r.status} ${(await r.text()).slice(0, 200)}` };
  const j = await r.json();
  if (!j.audioContent) return { err: "no audio" };
  const bin = atob(j.audioContent), out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return { out };
}
async function genCloud(text: string, lang: string, voice: string) {
  const errs: string[] = [];
  const lcs = lang === "en" ? ["en-GB", "en-US"] : ["ms-MY"];
  // 1) Gemini-TTS (perlu kunci terikat service account)
  for (const lc of lcs) {
    const r = await synth({ input: { prompt: STYLE[lang], text }, voice: { languageCode: lc, name: voice, modelName: "gemini-2.5-flash-tts" }, audioConfig: { audioEncoding: "MP3" } });
    if (r.out) return r.out;
    errs.push(`gemini/${lc}: ${r.err}`);
    if (r.err?.startsWith("403")) break;
  }
  // 2) Chirp 3 HD (kunci biasa)
  for (const lc of lcs) {
    const r = await synth({ input: { text }, voice: { languageCode: lc, name: `${lc}-Chirp3-HD-${voice}` }, audioConfig: { audioEncoding: "MP3", speakingRate: 0.92 } });
    if (r.out) return r.out;
    errs.push(`chirp/${lc}: ${r.err}`);
  }
  // 3) WaveNet (BM Malaysia)
  for (const lc of lcs) {
    const r = await synth({ input: { text }, voice: { languageCode: lc, name: `${lc}-Wavenet-${voice === "Sulafat" ? "A" : "B"}` }, audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 } });
    if (r.out) return r.out;
    errs.push(`wavenet/${lc}: ${r.err}`);
  }
  throw new Error(errs.join(" || ").slice(0, 600));
}
// buang senyap di awal/akhir & pendekkan jeda panjang
function tighten(pcm: Uint8Array, rate: number) {
  const s = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length >> 1);
  const win = Math.floor(rate * 0.02), n = Math.floor(s.length / win), thr = 350;
  const loud: boolean[] = [];
  for (let f = 0; f < n; f++) { let m = 0; for (let i = f * win; i < (f + 1) * win; i++) { const v = Math.abs(s[i]); if (v > m) m = v; } loud.push(m > thr); }
  let a = loud.indexOf(true), b = loud.lastIndexOf(true);
  if (a < 0) return pcm;
  a = Math.max(0, a - 3); b = Math.min(n - 1, b + 6);
  // hanya jeda > 360ms dipendekkan kepada ~280ms, dengan crossfade (tiada potong dalam perkataan)
  const segs: [number, number][] = []; let st = a, f = a;
  while (f <= b) {
    if (!loud[f]) { let e = f; while (e <= b && !loud[e]) e++; if (e - f > 18) { segs.push([st, f + 7]); st = e - 7; } f = e; } else f++;
  }
  segs.push([st, b + 1]);
  const xf = Math.floor(win / 2);
  const out = new Float32Array(segs.reduce((t, [p, q]) => t + (q - p) * win, 0));
  let pos = 0;
  segs.forEach(([p, q], k) => {
    const d = s.subarray(p * win, q * win);
    if (k === 0) { out.set(d, 0); pos = d.length; return; }
    const o = pos - xf;
    for (let i = 0; i < xf; i++) out[o + i] = out[o + i] * (1 - i / xf) + d[i] * (i / xf);
    for (let i = xf; i < d.length; i++) out[o + i] = d[i];
    pos = o + d.length;
  });
  const r = new Int16Array(pos); for (let i = 0; i < pos; i++) r[i] = Math.round(out[i]);
  return new Uint8Array(r.buffer);
}
function mp3(s: Int16Array, rate: number) {
  const enc = new Mp3Encoder(1, rate, 64), parts: Uint8Array[] = [];
  for (let i = 0; i < s.length; i += 1152) { const b = enc.encodeBuffer(s.subarray(i, i + 1152)); if (b.length) parts.push(new Uint8Array(b.buffer, b.byteOffset, b.length)); }
  const f = enc.flush(); if (f.length) parts.push(new Uint8Array(f.buffer, f.byteOffset, f.length));
  const out = new Uint8Array(parts.reduce((t, p) => t + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
// cuba sehingga 5 bacaan, ambil yang pertama capai sasaran tempoh (tiada lajukan tiruan — elak suara berganda/robot)
async function genVertex(text: string, lang: string, voice: string) {
  const target = lang === "en" ? 3.2 + 0.05 * text.length : 2.4 + 0.054 * text.length; // sasaran tempoh (saat)
  let best: { s: Int16Array; rate: number; dur: number } | null = null;
  for (let k = 0; k < 5; k++) {
    const r = await genVertex1(text, lang, voice);
    const dur = r.s.length / r.rate;
    if (!best || dur < best.dur) best = { ...r, dur };
    if (dur <= target) break;
  }
  return mp3(best!.s, best!.rate);
}
async function genVertex1(text: string, lang: string, voice: string): Promise<{ s: Int16Array; rate: number }> {
  const errs: string[] = [];
  for (const model of ["gemini-2.5-flash-tts", "gemini-2.5-pro-tts"]) {
    for (const withLang of [true, false]) {
      const speechConfig: any = { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } };
      if (withLang) speechConfig.languageCode = LANGCODE[lang];
      const r = await fetch(VERTEX_URL + model + ":generateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": VERTEX_KEY },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: (FEM.includes(voice) ? STYLE_F[lang] : STYLE[lang]) + "\n" + text }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig } }),
      });
      if (!r.ok) { errs.push(model + (withLang ? "/lang" : "") + ": " + r.status + " " + (await r.text()).slice(0, 200)); if (r.status === 400 && withLang) continue; break; }
      const j = await r.json();
      const p = j?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      if (!p) { errs.push(model + ": no audio"); continue; }
      const bin = atob(p.inlineData.data), pcm = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) pcm[i] = bin.charCodeAt(i);
      const rate = Number((p.inlineData.mimeType || "").match(/rate=(\d+)/)?.[1] || 24000);
      const t2 = tighten(pcm, rate);
      return { s: new Int16Array(t2.buffer, t2.byteOffset, t2.length >> 1), rate };
    }
  }
  throw new Error(errs.join(" || ").slice(0, 600));
}
async function gen(text: string, lang: string, voice: string) {
  let last = "";
  for (const model of MODELS) {
   for (const withLang of [true, false]) {
    const speechConfig: any = { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } };
    if (withLang) speechConfig.languageCode = LANGCODE[lang];
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE[lang]}\n${text}` }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig },
      }),
    });
    if (!r.ok) { last = `${model}: ${r.status} ${(await r.text()).slice(0, 200)}`; if (r.status === 400 && withLang) continue; break; }
    const j = await r.json();
    const b64 = j?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
    if (!b64) { last = `${model}: no audio`; continue; }
    const bin = atob(b64), pcm = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) pcm[i] = bin.charCodeAt(i);
    return wav(pcm);
   }
  }
  throw new Error(last);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const { text, lang, v, engine, voice, regen } = await req.json();
    const ALLOWED = ["Sulafat", "Achird", "Kore", "Aoede", "Leda", "Despina", "Achernar", "Callirrhoe", "Autonoe", "Erinome", "Vindemiatrix", "Laomedeia"];
    const VX = typeof voice === "string" && ALLOWED.includes(voice) ? voice : "";
    const t = String(text ?? "").trim();
    if (!t || t.length > 320 || !/^[\p{L}\p{N}\s.,:;!?'"()+\-−×÷=%\/–]+$/u.test(t)) return json({ error: "bad_text" }, 400);
    const L = lang === "en" ? "en" : "ms", V = v === "m" ? "m" : "f";
    const useG = engine !== "cloud" && (!!VERTEX_KEY || !!GEMINI_KEY); // Gemini = lalai
    const ext = useG ? (VERTEX_KEY ? "mp3" : "wav") : CLOUD_KEY ? "mp3" : "wav";
    const path = `${useG ? "m1" : VER}/${VX ? VX + "/" : ""}${V}/${L}/${await sha(VER + "|" + V + "|" + L + "|" + t)}.${ext}`;
    const pub = `${SB_URL}/storage/v1/object/public/tts/${path}`;
    const head = await fetch(pub, { method: "HEAD" });
    if (head.ok && regen !== true) return json({ url: pub, cached: true }); // regen:true = jana semula suara yang rosak
    if (!CLOUD_KEY && !GEMINI_KEY) return json({ error: "no_key" }, 503);
    const audio = useG ? (VERTEX_KEY ? await genVertex(t, L, VX || VOICES[V]) : await gen(t, L, VOICES[V])) : CLOUD_KEY ? await genCloud(t, L, VOICES[V]) : await gen(t, L, VOICES[V]);
    const up = await sb.storage.from("tts").upload(path, audio, { contentType: ext === "mp3" ? "audio/mpeg" : "audio/wav", upsert: true });
    if (up.error) throw up.error;
    return json({ url: pub, cached: false });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e).slice(0, 700) }, 500);
  }
});
