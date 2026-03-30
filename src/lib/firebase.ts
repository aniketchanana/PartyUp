import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCU4p_HudxoozephvpKgsHkHhcH6RV6UOU",
  authDomain: "invite-app-3f13c.firebaseapp.com",
  projectId: "invite-app-3f13c",
  storageBucket: "invite-app-3f13c.firebasestorage.app",
  messagingSenderId: "573742140468",
  appId: "1:573742140468:web:323b38fad5c873aa574e61",
  measurementId: "G-LH51FTX9CN",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
