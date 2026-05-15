// ============================================================
//  VUDIO.AI — Cloudflare Worker
//  Paste this into: Cloudflare Dashboard → Workers → Create Worker
//
//  How it works:
//    vudio.ai/blogs/novaskin  →  proxies to Pages app with ?brand=novaskin
//    vudio.ai/blogs/fitzone   →  proxies to Pages app with ?brand=fitzone
//    vudio.ai/*               →  your existing site, completely untouched
// ============================================================

// 👇 Replace with your actual Cloudflare Pages URL after deploying
const BLOG_APP = "https://vudio-blogs.pages.dev";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/blogs/")) {
      // Extract brand slug:  /blogs/novaskin  →  "novaskin"
      const slug = url.pathname.split("/")[2];

      if (!slug) return fetch(request); // no slug, pass through

      // Forward to Pages app as /?brand=novaskin
      // index.html reads the ?brand= param to load the right JSON
      const target = new URL(BLOG_APP);
      target.pathname = "/";
      target.searchParams.set("brand", slug);

      const response = await fetch(target.toString(), {
        method:  request.method,
        headers: request.headers,
        body:    request.body,
      });

      // Pass through all headers + status from Pages app
      return new Response(response.body, {
        status:  response.status,
        headers: response.headers,
      });
    }

    // Everything else → existing vudio.ai site, untouched
    return fetch(request);
  },
};