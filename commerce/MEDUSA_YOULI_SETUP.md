# Medusa Admin – Login & Product Setup for Youli Storefront

This guide helps you log in to Medusa Admin and add products so they appear on the correct website routes (e.g. `/collections/bras`, `/collections/sets`).

## 1. Start the backend and create an admin user

From the project root:

```bash
cd commerce
npm run dev
```

In another terminal, create an admin user (run once):

```bash
cd commerce
npx medusa user -e admin@youli.com -p YourSecurePassword
```

Use any email and password you like. You’ll use these to sign in at **http://localhost:9000/app/**.

## 2. Run the seed (creates Youli collections)

The seed creates three **product collections** that match the storefront routes:

| Collection title   | Handle   | Storefront URL        |
|--------------------|----------|------------------------|
| Signature Sets     | `sets`   | `/collections/sets`   |
| Bras               | `bras`   | `/collections/bras`   |
| Panties            | `panties`| `/collections/panties`|

Run the seed (with the backend running):

```bash
cd commerce
npm run seed
```

If the collections already exist, the seed skips creating them again.

## 3. Log in to Medusa Admin

1. Open **http://localhost:9000/app/** in your browser.
2. Sign in with the email and password you used in step 1.

## 4. Create a Publishable API key (for the storefront)

So the Next.js storefront can read products and collections:

1. In Medusa Admin go to **Settings** → **Developer** → **Publishable API Keys**.
2. Create a key (e.g. “Youli Storefront”) and link it to your **Default Sales Channel**.
3. Copy the key and add it to the Next.js app’s `.env.local` in the **project root** (not in `commerce/`):

   ```env
   MEDUSA_API_URL=http://localhost:9000
   MEDUSA_PUBLISHABLE_KEY=pk_xxxx
   ```

Restart the Next.js dev server after changing env.

## 5. Adding products that match the website routes

When you create or edit a product in Medusa Admin:

1. **Collection**  
   Assign the product to one of:
   - **Signature Sets** → it will appear on `/collections/sets` and “Shop All”.
   - **Bras** → `/collections/bras`.
   - **Panties** → `/collections/panties`.

2. **Handle**  
   Set the product **handle** to the slug you want in the URL, e.g.:
   - `noir-lace-set` → storefront URL: `/products/noir-lace-set`
   - Use lowercase letters and hyphens only (no spaces).

3. **Sales channel**  
   Ensure the product is in the same sales channel as your Publishable API key (e.g. Default Sales Channel), otherwise it won’t show on the storefront.

4. **Status**  
   Set the product to **Published** so it appears on the store.

After saving, the product will show on:

- `/collections/<handle>` (e.g. `/collections/sets`)
- `/products/<product-handle>` (e.g. `/products/noir-lace-set`)
- The main collections and “Shop All” pages when the storefront uses the Medusa API.

## 6. Quick reference – route ↔ Medusa

| What you want                         | In Medusa Admin                          |
|--------------------------------------|------------------------------------------|
| Page `/collections/sets`             | Collection **Signature Sets**, handle `sets` |
| Page `/collections/bras`             | Collection **Bras**, handle `bras`       |
| Page `/collections/panties`          | Collection **Panties**, handle `panties` |
| Page `/products/noir-lace-set`       | Product with handle `noir-lace-set`      |

If the Medusa API is not set or returns no data, the Next.js site falls back to local data in `lib/data/products.ts`.
