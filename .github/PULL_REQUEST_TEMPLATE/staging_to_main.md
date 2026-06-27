## Staging → Production

## What's included in this release?

<!-- List the features / fixes being promoted to prod -->

## Pre-merge checklist
- [ ] All changes verified on staging Vercel
- [ ] DB migrations run on **staging** Supabase and confirmed working
- [ ] No console errors or TypeScript errors
- [ ] Razorpay webhook tested (if billing changes)

## Post-merge checklist
- [ ] Run DB migrations on **prod** Supabase
- [ ] Confirm prod Vercel deploy succeeded
- [ ] Smoke test on prod URL
