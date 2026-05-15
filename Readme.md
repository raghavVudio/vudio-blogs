# vudio.ai Blog Pages

## Folder structure

```
vudio-blogs/
  index.html            ← one shared template (never edit per client)
  worker.js             ← paste into Cloudflare Worker (one-time setup)
  brands/
    novaskin.json       ← brand 1 config + posts
    fitzone.json        ← brand 2 config + posts
    yournextclient.json ← add forever, no code changes needed
```

---

## Test locally (no server needed)

Because `index.html` fetches `/brands/*.json` you need a tiny local
server (browser blocks file:// fetch by default).

**Option A — Python (easiest, already installed on most machines):**
```bash
cd vudio-blogs
python3 -m http.server 8080
```
Then open:
- http://localhost:8080/?brand=novaskin
- http://localhost:8080/?brand=fitzone

**Option B — VS Code Live Server extension:**
Right-click `index.html` → Open with Live Server, then add `?brand=novaskin` to the URL.

---

## Deploy to Cloudflare Pages (one-time)

1. Push this whole folder to a GitHub repo (e.g. `vudio-blogs`)
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Pick `vudio-blogs` repo
4. Build settings:
   - **Build command:** *(leave completely empty)*
   - **Build output directory:** `/`
5. Click **Save and Deploy**
6. You get a URL like `https://vudio-blogs.pages.dev` — keep this

---

## Set up the Cloudflare Worker (one-time)

1. Cloudflare Dashboard → Workers & Pages → Create → Worker
2. Delete all default code
3. Paste the contents of `worker.js`
4. Replace `BLOG_APP` value with your Pages URL from above
5. Click **Deploy** — name it `vudio-blog-router`

---

## Attach Worker to vudio.ai (one-time)

1. Cloudflare Dashboard → your `vudio.ai` zone
2. Left sidebar → **Workers Routes**
3. Add Route:
   - Route: `vudio.ai/blogs/*`
   - Worker: `vudio-blog-router`
4. Save

✅ Test:
- https://vudio.ai/blogs/novaskin  → NovaSkin blog (green accent)
- https://vudio.ai/blogs/fitzone   → FitZone blog (red accent)

Your existing vudio.ai site is completely unaffected.

---

## Adding a new brand client (takes 2 minutes)

1. Create `brands/newclient.json` — copy any existing JSON as a template
2. Fill in: slug, name, tagline, accent (hex color), logo, posts array
3. `git add . && git commit -m "add newclient" && git push`
4. Cloudflare Pages auto-rebuilds in ~30 seconds
5. `vudio.ai/blogs/newclient` is live — no other changes needed

---

## Brand JSON reference

```json
{
  "slug":    "brandname",
  "name":    "Brand Display Name",
  "tagline": "Short brand tagline",
  "accent":  "#FF6B00",
  "logo":    "◈",
  "posts": [
    {
      "id":       1,
      "tag":      "Category Name",
      "title":    "Article title here",
      "excerpt":  "Short description of the article shown on the card.",
      "readTime": "5 min read",
      "date":     "May 15, 2026",
      "featured": true,
      "keywords": ["keyword one", "keyword two", "keyword three"]
    }
  ]
}
```

- Only ONE post should have `"featured": true` — it becomes the big hero card
- `accent` is any hex color — the whole page theme updates automatically
- `slug` must match the filename: `brands/slug.json`