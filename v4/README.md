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
1. Create a **separate Firebase staging project** and configure Authentication authorized domains and email/password provider. The prototype now refuses to connect to the existing `asem-algel` project. It stays disabled until a separate staging project's public Firebase config is entered in `v4/config.js`.
2. Deploy and test rules in staging. These rules are a draft, not verified by the Firebase emulator. Confirm family creation, registration, invite redemption and multi-account isolation, including adversarial writes.
3. Ensure invites are single-use under concurrency; use server-side transaction/Cloud Functions for production. Validate expiration and membership changes atomically.
4. Migrate existing `shoppingLists/family` data and existing user IDs with a verified backup and reconciliation. Migration has not run.
5. Complete role management, member removal and admin transfer, catalog editing, default catalog items, quantities, reminder usability, UX and iOS/PWA regression tests.
6. Review public profile privacy and limit sensitive information; never store raw passwords in Firestore.
7. Update invite URLs and production hosting only after release.
8. Only merge after staging validation and data migration are signed off.

## Development safety
Do not replace the root `firestore.rules` with the v4 rules. Doing so could remove v3 access and break the current production app. Do not merge this PR into main until the release checklist is complete.

## Latest work
- Administrators can promote an existing member to administrator with a two-document atomic write. A promotion is not an exclusive ownership transfer: the original administrator retains the role.
- Administrators can remove another member with synchronized membership-index deletion.
- Catalog products can be renamed.
- Family selector now prioritizes the explicitly saved selection.

## Manual security test matrix (must run in a staging Firebase project)
| Scenario | Expected |
| --- | --- |
| Unauthenticated user reads family | Denied |
| Member A reads unrelated family B | Denied |
| Member A edits family B list | Denied |
| Member A self-promotes to admin | Denied |
| Admin A promotes member B with both records updated | Allowed |
| Admin A updates only B's membership role | Denied |
| Admin A removes B and their user index atomically | Allowed |
| Removed B tries to read the former family | Denied |
| Invitation link is used by a different email | Denied |
| Expired invitation or reused invitation | Denied |
| User attempts to claim existing username | Denied |
| New user creates first family after email verification | Allowed |
| Existing AlGel 3.0 users can still access legacy lists | Must remain working in production |

**No tests in this matrix have been executed against Firebase yet.** Rules must be validated in the Firebase emulator before production use. In particular, validate cross-document `getAfter` checks and the Firestore rules access-call budget. The current implementation also lacks a robust server-side invitation acceptance endpoint, migration tooling, and a safe production deployment procedure.

## Staging activation (not yet performed)
1. Create a separate Firebase project for AlGel 4.0 testing.
2. Enable Email/Password Authentication and Firestore for staging; add the intended test hosting domain to authorized domains.
3. Copy that project's **public web app config** into `v4/config.js` as `window.ALGEL_V4_FIREBASE = { apiKey: '...', authDomain: '...', projectId: '...', appId: '...' };`. Do not put service-account secrets or private keys in this repository.
4. Deploy `v4/firestore.rules` **only** to the staging project, then run the security matrix.
5. Test invitation links from the staging hosting URL, two browsers and two distinct verified accounts.
6. After a successful migration dry-run, define the production release and rollback plan separately.

## Legacy data migration inventory (read-only until staging approved)
Source document: `shoppingLists/family` (catalog and hiddenCatalog). Source collections: `shoppingLists/family/items`, `shoppingLists/family/listMeta/{listId}/items`, `shoppingLists/family/reminders`, and `shoppingLists/family/members`. Preserve all IDs, createdBy UIDs, quantities, units, timestamps, completion states and custom lists where possible. Target: `families/{newFamilyId}` with separate `members`, `lists/{listId}/items`, `catalog`, and `reminders`. Use an authenticated, audited server-side migration, a Firestore export/backup, item-count reconciliation, and dry-run before any write to production. **No migration has run.**
