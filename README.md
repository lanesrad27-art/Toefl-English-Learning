# TOEFLPro Platform — TOEFL Learning & English Fluency

A full-featured, deployable TOEFL iBT + PBT learning and English fluency web app.
Multi-file static project (HTML + CSS + JS), backed by **Supabase** (auth + database),
ready to drag-and-drop to **Netlify**. 100% free stack.

> The app works **immediately offline** (localStorage) even before you connect Supabase.
> Connect Supabase to enable accounts, cloud sync, and cross-device progress.

---

## 1. Run locally (no setup)

Because the app uses ES modules, open it through a tiny static server (not `file://`):

```bash
cd toefl-platform
python3 -m http.server 8080
# open http://localhost:8080
```

Without Supabase keys it runs in **Offline / Guest mode** — all features work and data is
stored in `localStorage`.

---

## 2. Connect Supabase (free tier)

1. Create a free account at https://supabase.com and make a **new project**.
2. Open **SQL Editor** and run the schema in [`supabase-schema.sql`](./supabase-schema.sql).
3. In **Project Settings → API**, copy your **Project URL** and **anon public key**.
4. Paste them into [`js/supabase.js`](./js/supabase.js):
   ```js
   const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'
   ```
5. (Optional) Enable **Google OAuth**: Supabase → Authentication → Providers → Google.
6. Set **Authentication → URL Configuration → Site URL** to your Netlify URL.

When valid keys are present, the app automatically switches from Offline mode to
Supabase auth + cloud database.

---

## 3. Deploy to Netlify (free)

- **Drag & drop:** zip-less — just drag the `toefl-platform` folder onto https://app.netlify.com/drop
- Or connect a Git repo. `netlify.toml` already includes SPA redirect config.
- After deploy, copy your site URL into Supabase **Site URL** (step 5 above) so OAuth redirects work.

---

## 4. Project structure

```
toefl-platform/
├── index.html              landing page + login/register
├── app.html                main app shell (after login)
├── supabase-schema.sql     run this in Supabase SQL Editor
├── netlify.toml            SPA redirect config
├── css/  (main, dark, components)
└── js/
    ├── supabase.js         config + auth + DB layer (offline fallback)
    ├── router.js           SPA navigation
    ├── tts.js              Text-to-Speech engine (two voices)
    ├── speech-recognition.js
    ├── <feature modules>.js
    └── data/               embedded content banks
```

## 5. Notes on content volume

The data banks under `js/data/` are wired data-driven, so you can freely expand any
array (vocabulary, questions, transcripts, etc.) without touching the module logic.
The shipped banks are high-quality representative sets; add more entries any time.
