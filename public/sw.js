// シンプルなオフラインキャッシュ用サービスワーカー（PWA）。
const CACHE = "selfcare-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ネットワーク優先、失敗時にキャッシュへフォールバック。
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  // 動画の部分読み込み（Range）はキャッシュせず、そのままブラウザに任せる
  if (request.headers.has("range")) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
