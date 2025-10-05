// src/utils/firebase.js
// Firebase v10+ Modular SDK

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";

// --- Your Firebase config (storageBucket fixed) ---
const firebaseConfig = {
  apiKey: "AIzaSyBazUFmKaThmqU-ux2UCJ358j9D-syXmUg",
  authDomain: "web-win-and-rule.firebaseapp.com",
  projectId: "web-win-and-rule",
  storageBucket: "web-win-and-rule.appspot.com", // ✅ must be PROJECT_ID.appspot.com
  messagingSenderId: "866752375701",
  appId: "1:866752375701:web:8a94d3622bad8f53bca49c",
  measurementId: "G-5BT3NTCEET",
};

// --- Initialize core services ---
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --- Optional: safe Analytics init (won't crash in dev/SSR) ---
export let analytics = null;
(async () => {
  try {
    if (typeof window !== "undefined" && (await analyticsIsSupported())) {
      analytics = getAnalytics(app);
    }
  } catch {
    analytics = null;
  }
})();

// --- Fixed admin credentials (demo-only) ---
// Used by AuthContext.loginAdminOnly() to sign in / auto-create the admin user.
export const ADMIN_EMAIL = "aniketsharma9360@gmail.com";
export const ADMIN_PASSWORD = "admin@aniket#00";

// Default export for convenience
export default app;
