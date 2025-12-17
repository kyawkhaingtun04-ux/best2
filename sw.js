/* =====================================================
   SUZI AI – Service Worker
   - PWA support
   - Push notifications
   - Safe update handling
   ===================================================== */

// 🔹 Install: activate immediately
self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

// 🔹 Activate: take control of all pages
self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(self.clients.claim());
});

// 🔹 Push Notification handler
self.addEventListener("push", (event) => {
  console.log("[SW] Push received");

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data.text() };
  }

  const title = data.title || "SUZI Reminder 🔔";
  const options = {
    body: data.body || "You have a reminder from SUZI",
    icon: "/suzi-profile.png",
    badge: "/suzi-profile.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 🔹 Notification click behavior
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked");
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
