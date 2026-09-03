import { initializeApp, cert, getApps } from "firebase-admin/app";
import serviceAccount from "./tcrrewards-firebase-adminsdk-fbsvc-1e3abc1298.json" with { type: "json" };

const firebaseConfig = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : serviceAccount;

const firebaseAdmin =
  getApps().length === 0
    ? initializeApp({
        credential: cert(firebaseConfig),
      })
    : getApps()[0];

export default firebaseAdmin;