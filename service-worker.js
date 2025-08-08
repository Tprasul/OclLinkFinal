const CACHE_NAME = 'kfc-portal-cache-v4'; // Версия кэша

// 1. Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker устанавливается, офлайн-кэш отключен.');
  self.skipWaiting();
});

// 2. Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Обработка запросов (оставляем пустым)
self.addEventListener('fetch', (event) => {
  // Ничего не делаем, браузер будет работать как обычно
  return;
});
