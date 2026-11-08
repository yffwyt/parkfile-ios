/* 楼宇档案 PWA Service Worker —— 由 tools/build-pwa.py 生成（spec §4） */
const CACHE = 'parkfile-pwa-v1';
const SCOPE = new URL('./', self.location.href).href;
/* 预缓存 shell（不预缓存 15MB onnx 与字体；install 时逐个 add，单个失败不致命） */
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './models/ppocr_keys_v1.txt',
].map((p) => new URL(p, SCOPE).href);
/* 大资源：cache-first + 成功后写缓存 */
const BIG = ['/fonts/', '/ort/', '/models/'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const url of SHELL) {
      try { await cache.add(new Request(url, { cache: 'reload' })); } catch (err) { /* 容错 */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // 跨域直接放行
  if (req.headers.get('range')) return;                     // 不处理 Range 请求
  const isBig = BIG.some((p) => url.pathname.indexOf(p) >= 0);

  // 导航请求：网络优先，失败回退缓存的 index.html
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(req);
      } catch (err) {
        const cache = await caches.open(CACHE);
        return (await cache.match(new URL('./index.html', SCOPE).href)) ||
          (await cache.match(SCOPE)) ||
          Response.error();
      }
    })());
    return;
  }

  if (isBig) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) { try { cache.put(req, res.clone()); } catch (err) {} }
      return res;
    })());
    return;
  }

  // 其余同源：cache-first，兜底网络
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) { try { cache.put(req, res.clone()); } catch (err) {} }
      return res;
    } catch (err) {
      return hit || Response.error();
    }
  })());
});
