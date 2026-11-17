# AlGel 4.0 — development preview

This branch is a **non-production prototype**. The existing AlGel 3.0 site and Firebase rules must remain unchanged until a verified migration and security review are complete.

## Implemented in /v4
- Email/password registration, email verification and password reset
- Username reservation, profile editing, verified email-change flow
- Multiple family creation and selection, family membership indexes
- 48-hour email-bound invite links, one-time invitation consumption in a Firestore batch
- Family-scoped lists, items, catalog, list requests, WhatsApp sharing
- Draft rules in `v4/firestore.rules` (NOT deployed)

## Blockers before production
1. Create a **separate Firebase staging project** and configure Authentication authorized domains and email/password provider. The prototype currently points at the existing `asem-algel` project; DO NOT test signups or change rules against production without approval.
2. Deploy and test rules in staging. These rules are a draft, not verified by the Firebase emulator. Confirm family creation, registration, invite redemption and multi-account isolation, including adversarial writes.
3. Ensure invites are single-use under concurrency; use server-side transaction/Cloud Functions for production. Validate expiration and membership changes atomically.
4. Migrate existing `shoppingLists/family` data and existing user IDs with a verified backup and reconciliation. Migration has not run.
5. Complete role management, member removal and admin transfer, catalog editing, default catalog items, quantities, reminder usability, UX and iOS/PWA regression tests.
6. Review public profile privacy and limit sensitive information; never store raw passwords in Firestore.
7. Update invite URLs and production hosting only after release.
8. Only merge after staging validation and data migration are signed off.

## Development safety
Do not replace the root `firestore.rules` with the v4 rules. Doing so could remove v3 access and break the current production app. Do not merge this PR into main until the release checklist is complete.
