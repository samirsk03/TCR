import cron from "node-cron";
import User from "../models/User.js";
import { getMessaging } from "firebase-admin/messaging";
import firebaseAdmin from "../config/firebaseAdmin.js";

const sendBirthdayNotificationsAutomatically = async () => {
  try {
    const now = new Date();

    const month = now.getMonth() + 1;
    const day = now.getDate();

    const customers = await User.find({
      role: "customer",
      dateOfBirth: { $exists: true, $ne: null },
      fcmToken: { $exists: true, $ne: null },
      isActive: true,
    });

    const birthdayCustomers = customers.filter((customer) => {
      const dob = new Date(customer.dateOfBirth);

      return (
        dob.getMonth() + 1 === month &&
        dob.getDate() === day
      );
    });

    console.log(
      `🎂 Birthday check: ${birthdayCustomers.length} customer(s) today`
    );

    for (const customer of birthdayCustomers) {
      try {
        const message = {
          token: customer.fcmToken,

          notification: {
            title: "🎂 Happy Birthday!",
            body: `Happy Birthday ${customer.name}! 🎉 We hope you have an amazing day. Here's a little something from TCR Rewards! 🍫`,
          },

          data: {
            type: "birthday",
            customerId: customer._id.toString(),
          },
        };

        const response = await getMessaging(firebaseAdmin).send(message);

        console.log(
          `✅ Birthday notification sent to ${customer.name}`,
          response
        );
      } catch (error) {
        console.error(
          `❌ Birthday notification failed for ${customer.name}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Birthday scheduler error:", error);
  }
};

// Runs every day at 9:00 AM IST
cron.schedule(
  "0 9 * * *",
  sendBirthdayNotificationsAutomatically,
  {
    timezone: "Asia/Kolkata",
  }
);

console.log("🎂 Birthday notification scheduler started — 9:00 AM IST");