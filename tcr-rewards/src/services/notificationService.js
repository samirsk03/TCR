import { getToken , onMessage} from "firebase/messaging";
import { messaging } from "../firebase";
import api from "./api";

const VAPID_KEY =
  "BAnfVfuXLZnyTbgL07EDTLY3DOZhjhEF_ERjGsA4WNMXHG_JFCkAfinVXCsIqHJZo6-cG3OTxTAizT7nNQlhl_g";

export const requestNotificationPermission = async () => {
  try {
    // Ask browser for notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Explicitly register Firebase messaging service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    console.log("✅ Firebase service worker registered");

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("No FCM token received");
      return null;
    }

    console.log("🔥 FCM TOKEN:", token);

    // Save token to backend
    await api.post("/auth/save-fcm-token", {
      token,
    });

    console.log("✅ FCM token saved to backend");

    return token;
  } catch (error) {
    console.error("❌ FCM TOKEN ERROR:", error);
    return null;
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("🔔 Foreground notification received:", payload);

    const title =
      payload.notification?.title || "TCR Rewards";

    const body =
      payload.notification?.body ||
      "You have a new notification from TCR Rewards.";

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/logo.png",
      });
    }
  });
};