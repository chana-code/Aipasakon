# Turn sign-in on (one-time, ~15 min)

The sign-up system is built. It needs a free Supabase project to store who signs up.
You never see or handle passwords.

## 1. Make a free Supabase project
1. Go to https://supabase.com → sign in with GitHub or email.
2. "New project" → name it (e.g. "ai-pasa-kon") → pick a region near Thailand
   (Singapore) → set a database password (save it somewhere) → Create.

## 2. Copy the two keys
1. In the project: Settings → API.
2. Copy **Project URL** and the **anon public** key.

## 3. Put them in the site
Open `website/.env.local` and set:

```
NEXT_PUBLIC_SUPABASE_URL=...paste Project URL...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...paste anon public key...
```

## 4. Create the member tables
1. In Supabase: SQL Editor → New query.
2. Paste the entire contents of `website/supabase/schema.sql` → Run.

## 5. (Optional) One-click Gmail sign-in
1. Supabase: Authentication → Providers → Google → enable.
2. Follow its link to create Google OAuth credentials, paste the Client ID/Secret back.

(If you skip this, email + password still works.)

## 6. Restart the site
Stop and re-run `npm run dev`. Sign-up now works, and locked articles unlock after login.
