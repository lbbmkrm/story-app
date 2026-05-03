import CONFIG from "../config";

const VAPID_PUBLIC_KEY = CONFIG.VAPID_PUBLIC_KEY ? CONFIG.VAPID_PUBLIC_KEY.trim() : "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Fitur notifikasi tidak diizinkan oleh pengguna");
  }
  return permission;
}

export async function getSwRegistered() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker tidak didukung pada browser ini");
  }

  const registration = await navigator.serviceWorker.ready;
  return registration;
}

export async function subscribePushNotification(registration) {
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    return existingSubscription;
  }

  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY.trim());
  console.log("Push Notification: Converted Key (Uint8Array):", applicationServerKey);

  const subscribtion = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey,
  });

  return subscribtion;
}

export async function unsubscribePushNotification(registration) {
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    await existingSubscription.unsubscribe();
    return true;
  }

  return true;
}

export async function isSubscribed(registration) {
  const existingSubscription = await registration.pushManager.getSubscription();
  return !!existingSubscription;
}
