// ERNS Real Estate - Web Push Service Worker
// Handles background push notifications when browser window is closed or in background

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Listen for background Push event from Web Push Server
self.addEventListener("push", (event) => {
  let payload = {
    title: "ERNS Real Estate",
    body: "You have a new message.",
    url: "/inbox",
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload.body = event.data.text();
    }
  }

  const title = payload.title || "ERNS Real Estate";
  const options = {
    body: payload.body || "New inquiry received.",
    icon: payload.icon || "/favicon.ico",
    badge: payload.badge || "/favicon.ico",
    data: {
      url: payload.url || "/inbox",
      dateOfArrival: Date.now(),
    },
    vibrate: [100, 50, 100],
    tag: payload.tag || "erns-inbox-notification",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 2. Handle notification click: Focus active tab or open /inbox
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || "/inbox";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        // If an ERNS inbox tab is already open, focus it
        for (const client of windowClients) {
          if (client.url.includes("/inbox") && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window to the target URL
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
