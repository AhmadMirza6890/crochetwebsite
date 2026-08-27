/* HearthsideYarn offline service worker
 * Caches the app shell, visited pages and static assets so the interface
 * stays available when the device loses its internet connection.
 * Only the native Android app registers this worker (see offline-provider).
 */

const VERSION = "v1";
const CACHE = `hearthside-cache-${VERSION}`;
const APP_SHELL = "/";

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Hearthside Yarn</title>
<style>
  :root { --bg:#FFF5F7; --fg:#3B0718; --primary:#E11D48; }
  * { box-sizing: border-box; }
  html,body { margin:0; height:100%; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: var(--bg); color: var(--fg);
    display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .card {
    max-width: 420px; width:100%; text-align:center;
    background:#fff; border:1px solid #f3d9e1; border-radius:20px; padding:32px 24px;
    box-shadow: 0 10px 30px rgba(225,29,72,0.08);
  }
  .badge {
    display:inline-flex; align-items:center; gap:8px; font-weight:600;
    color:var(--primary); background:#fde7ee; padding:8px 14px; border-radius:999px; margin-bottom:16px;
  }
  h1 { font-size:1.4rem; margin:0 0 8px; }
  p { line-height:1.5; color:#7a4a5c; margin:0 0 20px; }
  a {
    display:inline-block; text-decoration:none; font-weight:600; color:#fff;
    background:var(--primary); padding:12px 22px; border-radius:999px;
  }
  .dot { width:8px; height:8px; border-radius:50%; background:var(--primary); }
</style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> You're offline</div>
    <h1>Hearthside Yarn is still here</h1>
    <p>You're offline. Some content may be unavailable until your connection returns.
       Pages you've already opened will keep working.</p>
    <a href="/">Go to home</a>
  </div>
</body>
</html>`;

function isStaticAsset(url) {
  if (url.origin !== self.location.origin) return false;
  const p = url.pathname;
  return (
    p.startsWith("/_next/static/") ||
    p.startsWith("/images/") ||
    p.startsWith("/uploads/") ||
    p.startsWith("/fonts/") ||
    p.startsWith("/icons/") ||
    p.startsWith("/videos/") ||
    p.startsWith("/favicon") ||
    /\.(?:css|js|mjs|woff2?|ttf|otf|eot|png|jpe?g|gif|svg|webp|avif|mp4|webm|ico)$/i.test(p)
  );
}

async function cachePut(request, response) {
  if (!response || response.status !== 200 || response.type === "error") return;
  const cache = await caches.open(CACHE);
  cache.put(request, response.clone());
}

async function cacheUrl(url) {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (res && res.status === 200) await cachePut(url, res);
  } catch (_) {
    /* ignore individual failures */
  }
}

// Cache the app shell plus its referenced scripts, styles, fonts and images
// so the interface can start even on a cold offline launch (Test 2).
async function cacheAppShell() {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(APP_SHELL, { cache: "no-cache" });
    if (res && res.status === 200) await cache.put(APP_SHELL, res);
  } catch (_) {
    return;
  }
  try {
    const html = await res.text();
    const urls = new Set();
    const re = /(?:src|href)="(\/[^"?#]+)"/gi;
    let m;
    while ((m = re.exec(html))) {
      const u = new URL(m[1], self.location.origin);
      if (u.origin === self.location.origin) urls.add(u.href);
    }
    // Also grab any /_next/ asset paths that may appear in inline JSON.
    const nextRe = /"\/(_next\/[^"]+)"/gi;
    while ((m = nextRe.exec(html))) urls.add(new URL(m[1], self.location.origin).href);
    await Promise.all([...urls].map((u) => cacheUrl(u)));
  } catch (_) {
    /* best-effort */
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never cache POST/PUT/etc.

  const url = new URL(req.url);

  // Server actions and API routes must always hit the network.
  if (url.pathname.startsWith("/api/")) return;

  // Navigation requests: network-first, fall back to cache, then app shell, then offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          await cachePut(req, res);
          return res;
        } catch (err) {
          const cache = await caches.open(CACHE);
          const cached = await cache.match(req);
          if (cached) return cached;
          const shell = await cache.match(APP_SHELL);
          if (shell) return shell;
          return new Response(OFFLINE_HTML, {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // Static assets: cache-first with background refresh. Images cached cross-origin too.
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        if (cached) {
          const refresh = fetch(req)
            .then((res) => cachePut(req, res))
            .catch(() => {});
          event.waitUntil(refresh);
          return cached;
        }
        try {
          const opts = req.destination === "image" ? { mode: "no-cors" } : undefined;
          const res = await fetch(req, opts);
          if (res && (res.status === 200 || res.type === "opaque")) {
            cache.put(req, res.clone());
          }
          return res;
        } catch (err) {
          if (req.destination === "image") {
            const fallback = await cache.match("/images/crochet-hero-bg.jpg");
            if (fallback) return fallback;
          }
          return new Response("", { status: 504 });
        }
      })()
    );
    return;
  }

  // Other same-origin GET (RSC payloads, dynamic HTML fragments): network-first with cache.
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          await cachePut(req, res);
          return res;
        } catch (err) {
          const cached = await caches.match(req);
          if (cached) return cached;
          return new Response("", { status: 504 });
        }
      })()
    );
    return;
  }

  // Cross-origin (fonts, external images): best-effort cache.
  if (req.destination === "image" || req.destination === "font") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req, { mode: "no-cors" });
          cache.put(req, res.clone());
          return res;
        } catch (err) {
          return new Response("", { status: 504 });
        }
      })()
    );
  }
});
