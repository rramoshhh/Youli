# guidelines.md — Codex rules (Next.js + Commerce backend + Strapi + Postgres + Stripe)

## Mission
Build a **production-ready ecommerce platform** with:

- **Storefront**: Next.js
- **E-commerce backend**: Medusa *(preferred)* or Vendure / Saleor
- **Content CMS**: Strapi (blog, pages, lookbook)
- **Database**: PostgreSQL
- **Search (optional)**: Meilisearch
- **Analytics (self-hosted)**: Umami *(preferred)* or Matomo
- **Payments**: Stripe

Codex must deliver features through small, safe, reviewable changes.  
No speculative refactors.

---

## Non-negotiables
1. **Do not break** routes, env vars, schemas, or API contracts without migrations + notes.
2. **Do not delete files** unless clearly unused and listed in the summary.
3. **No large refactors** unless explicitly requested.
4. **Never commit secrets** — env vars only, `.env.example` updated.
5. **Prices and totals** must always be computed server-side.
6. **Stripe webhooks** must be verified and idempotent.
7. **No template/source links** left in UI.

---

## Architecture responsibilities

### Next.js (storefront)
- UI, navigation, SEO, cart UX, CMS pages.
- Calls commerce/CMS APIs only through `lib/clients/*`.
- Server Components for data, Client Components only for interactions.

### Commerce backend (Medusa / Vendure / Saleor)
- Products, variants, pricing, promotions, tax, shipping, inventory, orders.
- Stripe integration server-side.

### Strapi
- Editorial content only.
- No pricing or checkout logic.

### PostgreSQL
- Main DB for commerce backend.
- Strapi DB should be separate or documented.

### Meilisearch (optional)
- Product indexing/search.
- Storefront must still work without it.

### Analytics (Umami / Matomo)
- Privacy-friendly tracking.
- Events: product_view, add_to_cart, begin_checkout, purchase.

---

## Default choices (unless repo says otherwise)
- Prefer Medusa as backend.
- Use Stripe Checkout **or** Payment Intents — pick one and stay consistent.
- Cart persistence must be documented.

---

## Repo layout (if monorepo)

- `apps/storefront`
- `apps/commerce`
- `apps/cms`
- `packages/shared`
- `infra/`
- `docs/`

Do not reorganize without being asked.

---

## Naming & contracts
- Use backend IDs (`productId`, `variantId`).
- Money in minor units (cents).
- Stable, canonical slugs.

---

## Frontend rules (Next.js)

### Data fetching
- PLP/PDP via Server Components + caching.
- Cart/checkout always dynamic.
- API wrappers in `lib/clients/*`.

### SEO (mandatory)
- `generateMetadata` everywhere.
- Canonicals for filters/sort.
- OpenGraph tags.
- Product JSON-LD when feasible.

### UX (mandatory)
- Skeleton loaders.
- Empty states.
- Inline errors.
- Mobile-first.
- Consistent UI system.

### Accessibility (mandatory)
- Keyboard navigation.
- Visible focus.
- Alt text.
- Semantic HTML.

### Performance
- Keep client bundle small.
- Dynamic imports for heavy UI.
- `next/image` everywhere.

---

## Ecommerce flows

### Product listings (PLP)
- Filters/sort via query params.
- Pagination preferred.
- Back-button friendly.

### Product detail (PDP)
- Accessible gallery.
- Variant handling.
- Fast Add-to-Cart feedback.

### Cart
Line item shape:
- `productId`
- `variantId`
- `qty`
- `unitPrice`
- `currency`
- `name`
- `image`
- `slug`

Qty min 1; enforce stock.

### Checkout (Stripe)
- All totals server-side.
- Webhooks verified + idempotent.
- Order lifecycle documented.

---

## Backend rules
- Stripe only server-side.
- Validate all inputs.
- Inventory consistency.
- No duplicated pricing logic.

---

## Strapi rules
- Content types: Page, Post, Lookbook, Global.
- Preview support.
- Sanitized rich text.
- No checkout logic.

---

## Search (Meilisearch)
- Sync jobs/indexers server-side.
- Frontend debounce + fallback.

---

## Analytics
- No PII.
- Track funnel events.

---

## Environment variables
When adding env vars:

1. Add to `.env.example`
2. Document in README
3. Never commit secrets

Examples:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_UMAMI_URL`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRAPI_URL`
- `DATABASE_URL`
- `MEILI_HOST`

---

## Docker / Dev setup
- Prefer docker-compose.
- Document startup in `docs/DEV.md`.
- No heavy infra additions.

---

## Security
- No sensitive logs.
- CSRF-safe mutations.
- Rate-limit auth/checkout/webhooks.
- Verify Stripe signatures.

---

## Testing & quality gates
Each change should:
- build successfully
- pass lint (best effort)
- include tests only when valuable

---

## Required PR / commit summary
Always include:

- What changed
- Why
- How to test
- Env vars added/changed
- Files removed
- Operational notes

---

## When unsure
- Read the repo first.
- Make the smallest useful change.
- Mock missing services clearly.
