import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBazUFmKaThmqU-ux2UCJ358j9D-syXmUg",
  authDomain: "web-win-and-rule.firebaseapp.com",
  projectId: "web-win-and-rule",
  storageBucket: "web-win-and-rule.firebasestorage.app",
  messagingSenderId: "866752375701",
  appId: "1:866752375701:web:8a94d3622bad8f53bca49c",
  measurementId: "G-5BT3NTCEET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;