# Supabase Setup (NoVaNode)

## 1) Create project + get keys
In Supabase dashboard, copy:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2) Run schema
- Open SQL editor
- Run `supabase/schema.sql`

## 3) Set env vars
In `.env.local` and deploy provider env:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_ENABLE_COMMUNITY=true
```

## 4) Deploy
After env vars are set, redeploy and test:
- vibe upload
- seat status
- speed submit
- work buddy

## Notes
- Service role key must stay server-side only.
- Current code falls back gracefully when Supabase is not configured.
