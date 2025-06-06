const CACHE_NAME = 'peerly-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/login.html',
  '/signup.html',
  '/dashboard.html',
  '/courses.html',
  '/course-details.html',
  '/profile.html',
  '/settings.html',
  '/messages.html',
  '/video-lecture.html',
  '/404.html',
  // Add more assets as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
}); 