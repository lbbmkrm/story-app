import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// ─── Strategi Caching ────────────────────────────────────────────────────────

// Cache Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
);

// Cache Leaflet
registerRoute(
  ({ url }) => url.origin === "https://unpkg.com",
  new CacheFirst({
    cacheName: "leaflet-cache",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
);

// Cache tile peta OpenStreetMap
registerRoute(
  ({ url }) => url.hostname.includes("tile.openstreetmap.org"),
  new CacheFirst({
    cacheName: "map-tiles-cache",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);

// Cache data API stories — NetworkFirst agar selalu fresh saat online,
// fallback ke cache saat offline
registerRoute(
  ({ url }) => url.origin === "https://story-api.dicoding.dev",
  new NetworkFirst({
    cacheName: "story-api-cache",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  }),
);

// Cache Gambar Cerita (Foto dari API)
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "story-images-cache",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Hari
      }),
    ],
  }),
);

// Penanganan Background Sync untuk Unggah Cerita (Kriteria Advanced)
const bgSyncPlugin = new BackgroundSyncPlugin("story-queue", {
  maxRetentionTime: 24 * 60, // Coba kirim ulang selama 24 jam
});

registerRoute(
  ({ url }) => url.origin === "https://story-api.dicoding.dev" && url.pathname.endsWith("/stories"),
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  "POST",
);

// ─── Push Notification Handler ────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  if (!event.data) {
    console.warn("Push event had no data.");
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (err) {
    console.log("Push data is not JSON, using text instead.");
    data = { title: "Story App", body: event.data.text() };
  }

  // Mendukung berbagai format payload (title/body, notification.title/body, atau options.body)
  const title = data.title || data.notification?.title || "Cerita Baru!";
  const body = 
    data.options?.body || 
    data.body || 
    data.notification?.body || 
    data.message || 
    "Seseorang baru saja membagikan momen baru.";
  const icon = data.icon || data.notification?.icon || "/images/logo.png";
  
  const options = {
    body: body,
    icon: icon,
    badge: "/images/logo.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || data.notification?.click_action || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
