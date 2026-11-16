# Jaguh Mat

Game Matematik KSSR (Semakan 2017) untuk murid **Tahun 1–3**, dwibahasa (BM / English).

- Bab demi bab, tahap demi tahap, kuiz selepas setiap bab
- Suara cikgu (Google Gemini TTS) membaca setiap soalan
- Papan skor sendiri + papan skor online (Supabase)

Main: https://wancf79-coder.github.io/jaguh-mat/

## Struktur
- `index.html` — game lengkap (satu fail)
- `src/` — kod sumber (`gen.js` penjana soalan, `ui.js` antara muka, `style.css`); bina semula dengan `python3 src/build.py`
- `supabase/supabase_setup.sql` — jadual & fungsi papan skor
- `supabase/functions/tts/` — pelayan suara (perlu secret `GEMINI_API_KEY`)
