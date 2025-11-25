export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        console.log('Service Worker registered successfully:', registration.scope);
        
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    return await navigator.serviceWorker.ready;
  }
  return null;
}

export async function sendMessageToSW(message: any) {
  const registration = await getServiceWorkerRegistration();
  if (registration && registration.active) {
    registration.active.postMessage(message);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  return Notification.permission;
}
