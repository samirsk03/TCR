importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCp7IuYnV4a1TlYIQY551YIyKdY6m8E1v8",
  authDomain: "tcrrewards.firebaseapp.com",
  projectId: "tcrrewards",
  storageBucket: "tcrrewards.firebasestorage.app",
  messagingSenderId: "870679743104",
  appId: "1:870679743104:web:496efda04f045f12857465",
  measurementId: "G-YBM8HZ930Y",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle =
    payload.notification?.title || "TCR Rewards";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "You have a new notification from TCR Rewards.",
    icon: "/logo.png",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});