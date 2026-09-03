import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { requestNotificationPermission } from "../services/notificationService";

const NotificationPrompt = () => {
  const [show, setShow] = useState(false);

//   useEffect(() => {
//     // Don't show if browser already decided
//     if (!("Notification" in window)) return;

//     if (Notification.permission === "default") {
//       const alreadyAsked = localStorage.getItem(
//         "tcr_notification_prompt"
//       );

//       if (!alreadyAsked) {
//         setShow(true);
//       }
//     }
//   }, []);/

useEffect(() => {
  requestNotificationPermission();
}, []);

  const handleAllow = async () => {
    localStorage.setItem("tcr_notification_prompt", "true");

    const token = await requestNotificationPermission();

    if (token) {
      console.log("FCM TOKEN:", token);
    }

    setShow(false);
  };

  const handleNotNow = () => {
    localStorage.setItem("tcr_notification_prompt", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-5">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">

        <button
          onClick={handleNotNow}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
          <Bell className="text-orange-500" size={28} />
        </div>

        <h2 className="mt-5 text-xl font-bold">
          Stay updated with TCR Rewards 🎉
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Get birthday offers, special rewards and important
          updates directly on your device.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleNotNow}
            className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-600"
          >
            Not Now
          </button>

          <button
            onClick={handleAllow}
            className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold text-white"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;