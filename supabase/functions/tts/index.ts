// Jaguh Mat — suara soalan (Gemini TTS) dengan cache dalam Storage "tts"
import { createClient } from "npm:@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const sb = createClient(SB_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
const VOICES: Record<string, string> = { f: "Sulafat", m: "Achird" }; // cikgu perempuan / cikgu lelaki
const STYLE: Record<string, string> = {
  ms: "Baca ayat berikut dalam Bahasa Melayu Malaysia dengan suara seorang cikgu sekolah rendah yang mesra, jelas dan tenang, sedikit perlahan untuk murid berumur 7 hingga 9 tahun. Sebut nombor dengan jelas:",
  en: "Read the following in clear English like a friendly, calm Malaysian primary school teacher speaking slightly slowly to pupils aged 7 to 9. Say the numbers clearly:",
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
async function gen(text: string, lang: string, voice: string) {
  let last = "";
  for (const model of MODELS) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE[lang]}\n${text}` }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
      }),
    });
    if (!r.ok) { last = `${model}: ${r.status} ${(await r.text()).slice(0, 200)}`; continue; }
    const j = await r.json();
    const b64 = j?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
    if (!b64) { last = `${model}: no audio`; continue; }
    const bin = atob(b64), pcm = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) pcm[i] = bin.charCodeAt(i);
    return wav(pcm);
  }
  throw new Error(last);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const { text, lang, v } = await req.json();
    const t = String(text ?? "").trim();
    if (!t || t.length > 320 || !/^[\p{L}\p{N}\s.,:;!?'"()+\-−×÷=%\/–]+$/u.test(t)) return json({ error: "bad_text" }, 400);
    const L = lang === "en" ? "en" : "ms", V = v === "m" ? "m" : "f";
    const path = `${V}/${L}/${await sha(V + "|" + L + "|" + t)}.wav`;
    const pub = `${SB_URL}/storage/v1/object/public/tts/${path}`;
    const head = await fetch(pub, { method: "HEAD" });
    if (head.ok) return json({ url: pub, cached: true });
    if (!GEMINI_KEY) return json({ error: "no_key" }, 503);
    const audio = await gen(t, L, VOICES[V]);
    const up = await sb.storage.from("tts").upload(path, audio, { contentType: "audio/wav", upsert: true });
    if (up.error) throw up.error;
    return json({ url: pub, cached: false });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e).slice(0, 300) }, 500);
  }
});
