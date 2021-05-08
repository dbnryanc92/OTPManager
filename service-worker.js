const VERSION = "0.3";
var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = [
  "/",
  "/css/style.css",
  "/img/favicon.ico",
  "/img/apple-touch-icon.png",
  "/img/icon192.png",
  "/img/icon512.png",
  "/js/otp.js",
  "/js/script.js",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .then(function (e) {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
