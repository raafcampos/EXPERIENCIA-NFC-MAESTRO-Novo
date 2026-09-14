/* Service worker: mantém a experiência funcionando sem internet no evento.
   Textos/código: rede primeiro (atualizações aparecem quando há conexão).
   Imagens, vídeos e fontes: cache primeiro. */
const CACHE = 'maestro-nfc-v7'; // aumente junto com o ?v= do index.html
const CORE = [
  './', 'index.html', 'css/style.css', 'js/modulos.js', 'js/app.js', 'manifest.webmanifest',
  'assets/logos/maestro-negativo.png', 'assets/logos/sete-negativo.png', 'assets/logos/icone-maestro.png',
  'assets/fonts/Maxeville-Regular.ttf', 'assets/fonts/Maxeville-Bold.ttf', 'assets/fonts/Maxeville-Construct.ttf'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  if (req.headers.has('range')) { e.respondWith(rangeResponse(req)); return; }

  const isMedia = /\.(jpe?g|png|webp|gif|svg|mp4|webm|ttf|otf|woff2?)$/i.test(new URL(req.url).pathname);
  e.respondWith(isMedia ? cacheFirst(req) : networkFirst(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('index.html')) || Response.error();
  }
}

// Vídeos pedem pedaços do arquivo (Range); responde a partir do arquivo completo em cache.
async function rangeResponse(req) {
  const cache = await caches.open(CACHE);
  let res = await cache.match(req.url);
  if (!res) {
    try {
      res = await fetch(req.url);
      if (!res.ok) return res;
      await cache.put(req.url, res.clone());
    } catch {
      return Response.error();
    }
  }
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  const start = m && m[1] ? +m[1] : 0;
  const end = Math.min(m && m[2] ? +m[2] : size - 1, size - 1);
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}
