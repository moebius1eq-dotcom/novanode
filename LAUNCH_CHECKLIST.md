# NoVaNode Launch Checklist

## Security
- [ ] Set `NOVANODE_ADMIN_TOKEN` in production environment.
- [ ] Access admin pages with `?token=<your-token>` or `x-admin-token` header.
- [ ] Confirm `/admin/*` and `/api/admin/*` return 401 without token.

## Reliability
- [ ] Verify homepage map loads, zoom/pan works, and pins are readable.
- [ ] Confirm speed/seat/vibe/newsletter/work-buddy endpoints work with rate limits.
- [ ] Check static build output and deploy logs for warnings/errors.

## Growth
- [ ] Add real affiliate URLs and partner referral links.
- [ ] Set branded icon files (`/public/icon-192.png`, `/public/icon-512.png`).
- [ ] Announce launch in local channels (Reddit/Nextdoor/Discord).

## QA smoke test
- [ ] `npm run build`
- [ ] Browse: `/`, `/compare`, one `/location/*`, `/admin?token=...`, `/admin/moderation?token=...`
