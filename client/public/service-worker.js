const CACHE_NAME = 'leveli-v1';
const TIMER_NOTIFICATION_TAG = 'leveli-timer';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.png'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_TIMER_NOTIFICATION') {
    const { remaining, isRunning } = event.data;
    
    if (isRunning && remaining > 0) {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      self.registration.showNotification('Focus Timer Running', {
        body: `Time remaining: ${timeString}`,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: TIMER_NOTIFICATION_TAG,
        requireInteraction: false,
        silent: true,
        data: { remaining, isRunning }
      });
    } else if (remaining === 0) {
      self.registration.showNotification('Timer Complete! 🎉', {
        body: 'Great work! Your focus session is complete.',
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: TIMER_NOTIFICATION_TAG,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: { completed: true }
      });
    }
  } else if (event.data && event.data.type === 'CLEAR_TIMER_NOTIFICATION') {
    self.registration.getNotifications({ tag: TIMER_NOTIFICATION_TAG }).then((notifications) => {
      notifications.forEach((notification) => notification.close());
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === self.registration.scope && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if no existing window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
