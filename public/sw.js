// Service Worker para cache de recursos
const CACHE_NAME = 'madenai-v2';
const OLD_CACHES = ['madenai-v1'];

// Cache apenas recursos estáticos durante desenvolvimento
const urlsToCache = [
  '/',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (OLD_CACHES.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Cachear apenas recursos estáticos
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
    ])
  );
  // Forçar ativação imediata
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Limpar todos os caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar controle imediatamente
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Durante desenvolvimento, não cachear arquivos do Vite (CSS, JS, etc)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    // Só cachear fontes externas e assets estáticos
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            return fetch(event.request).then((fetchResponse) => {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
              return fetchResponse;
            });
          })
      );
    } else {
      // Para arquivos locais durante dev, sempre buscar do servidor
      event.respondWith(fetch(event.request));
    }
  } else {
    // Em produção, usar estratégia de cache normal
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((fetchResponse) => {
            // Só cachear respostas OK
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          });
        })
    );
  }
});