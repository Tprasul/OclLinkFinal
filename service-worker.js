// Увеличиваем версию кэша. Меняйте эту цифру КАЖДЫЙ раз, когда обновляете сайт.
const CACHE_NAME = 'kfc-portal-cache-v5'; 
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/home.html', 
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// --- Установка Service Worker ---
// Этот шаг срабатывает, когда браузер видит новую версию скрипта (из-за смены CACHE_NAME).
self.addEventListener('install', (event) => {
  console.log('Установка новой версии Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Кэшируем основные файлы "про запас".
      return cache.addAll(URLS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Принудительно активируем новый Service Worker
  );
});

// --- Активация Service Worker ---
// Здесь происходит очистка старых кэшей.
self.addEventListener('activate', (event) => {
  console.log('Активация новой версии и очистка старого кэша.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Перехватываем управление страницей
  );
});

// --- Обработка запросов (Стратегия "Network First") ---
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // 1. Сначала всегда идем в интернет
    fetch(event.request)
      .catch((err) => {
        // 2. Если интернета нет, браузер сам покажет ошибку.
        // Мы НЕ отдаем старую версию из кэша, как вы и просили.
        console.error('Ошибка сети, офлайн-режим отключен:', err);
        // Эта ошибка приведет к стандартной странице "Нет подключения к интернету" в браузере.
        throw err;
      })
  );
});
