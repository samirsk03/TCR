import User from "../models/User.js";
import { getMessaging } from "firebase-admin/messaging";
import firebaseAdmin from "../config/firebaseAdmin.js";

// Send birthday notifications to customers whose birthday is today
export const sendBirthdayNotifications = async (req, res) => {
  try {
    const today = new Date();

    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Find customers who have DOB + FCM token
    const customers = await User.find({
      role: "customer",
      dateOfBirth: { $exists: true, $ne: null },
      fcmToken: { $exists: true, $ne: null },
      isActive: true,
    });

    // Filter birthday by month + day
    const birthdayCustomers = customers.filter((customer) => {
      const dob = new Date(customer.dateOfBirth);

      return (
        dob.getMonth() + 1 === month &&
        dob.getDate() === day
      );
    });

    if (birthdayCustomers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No birthdays today",
        count: 0,
      });
    }

    const results = [];

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

        results.push({
          customer: customer.name,
          success: true,
          messageId: response,
        });
      } catch (error) {
        console.error(
          `❌ Birthday notification failed for ${customer.name}:`,
          error.message
        );

        results.push({
          customer: customer.name,
          success: false,
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Birthday notifications processed",
      count: birthdayCustomers.length,
      results,
    });
  } catch (error) {
    console.error("❌ BIRTHDAY NOTIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};