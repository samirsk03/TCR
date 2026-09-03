import { initializeApp, cert, getApps } from "firebase-admin/app";
import serviceAccount from "./tcrrewards-firebase-adminsdk-fbsvc-1e3abc1298.json" with { type: "json" };

const firebaseAdmin =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

export default firebaseAdmin;