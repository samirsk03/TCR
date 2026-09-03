import { initializeApp, cert, getApps } from "firebase-admin/app";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const { default: localServiceAccount } = await import(
    "./tcrrewards-firebase-adminsdk-fbsvc-1e3abc1298.json",
    {
      with: { type: "json" },
    }
  );

  serviceAccount = localServiceAccount;
}

const firebaseAdmin =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

export default firebaseAdmin;