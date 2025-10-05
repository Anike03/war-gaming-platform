// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db, ADMIN_EMAIL, ADMIN_PASSWORD } from "../utils/firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);  // Firebase Auth user
  const [userData, setUserData] = useState(null);        // Firestore profile
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Firestore helpers ----------
  const userRef = (uid) => doc(db, "users", uid);

  const createUserDocument = async (user, extra = {}) => {
    if (!user?.uid) return null;
    const ref = userRef(user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // first time: create a profile
      const base = {
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? (user.email ? user.email.split("@")[0] : ""),
        photoURL: user.photoURL ?? null,
        points: 0,
        status: "active",
        isAdmin: false,
        createdAt: serverTimestamp(),
      };
      await setDoc(ref, { ...base, ...extra });
      return { ...(base), ...extra };
    } else if (Object.keys(extra).length) {
      await setDoc(ref, extra, { merge: true });
      const merged = { ...snap.data(), ...extra };
      return merged;
    }
    return snap.data();
  };

  const loadUserProfile = async (user) => {
    if (!user) { setUserData(null); return; }
    const snap = await getDoc(userRef(user.uid));
    setUserData(snap.exists() ? snap.data() : null);
  };

  // ---------- Auth API ----------
  const signup = async (email, password, { displayName } = {}) => {
    setAuthError(null);
    // Never allow public registration with reserved admin email
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      const err = new Error("This email is reserved for admin and cannot be registered.");
      setAuthError(err.message);
      throw err;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    await createUserDocument(cred.user, { displayName, isAdmin: false });
    await loadUserProfile(cred.user);
    return cred.user;
  };

  const login = async (email, password) => {
    setAuthError(null);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await loadUserProfile(cred.user);
    return cred.user;
  };

  // 🔐 Admin fixed-credential login (auto-provision if missing)
  // inside AuthProvider in src/context/AuthContext.jsx
const loginAdminOnly = async () => {
  setAuthError(null);
  try {
    // Try to sign in with the fixed creds
    const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    await createUserDocument(cred.user, { isAdmin: true, displayName: "Admin" });
    await loadUserProfile(cred.user);
    return cred.user;
  } catch (e) {
    // Firebase Web SDK v10+ often returns auth/invalid-credential for both
    // "user-not-found" AND "wrong-password". We handle both safely.

    // 1) Try to CREATE the admin user (bootstrap first login)
    try {
      const cred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      await updateProfile(cred.user, { displayName: "Admin" });
      await createUserDocument(cred.user, { isAdmin: true, displayName: "Admin" });
      await loadUserProfile(cred.user);
      return cred.user;
    } catch (createErr) {
      // 2) If email already exists -> the password is wrong. We can't change it client-side.
      if (createErr.code === "auth/email-already-in-use") {
        const msg =
          "Admin account exists but the password doesn't match. " +
          "Open Firebase Console → Authentication → Users and set the admin password to admin@aniket#00, " +
          "or delete the admin user so it can be auto-created.";
        setAuthError(msg);
        throw new Error(msg);
      }
      // Other creation errors (network, disabled provider, etc.)
      setAuthError(createErr.message || "Failed to sign in as admin.");
      throw createErr;
    }
  }
};


  const googleSignIn = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await createUserDocument(cred.user, { displayName: cred.user.displayName || "" });
    await loadUserProfile(cred.user);
    return cred.user;
  };

  const resetPassword = async (email) => {
    setAuthError(null);
    return sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
    setUserData(null);
  };

  const updateUserProfileSafe = async (partial) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, partial);
    await createUserDocument(auth.currentUser, { displayName: auth.currentUser.displayName || "" });
    await loadUserProfile(auth.currentUser);
  };

  const updateUserData = async (partial) => {
    if (!auth.currentUser) return;
    await setDoc(userRef(auth.currentUser.uid), partial, { merge: true });
    await loadUserProfile(auth.currentUser);
  };

  // Points helpers (used by games/redeem)
  const addPoints = async (amount, reason = "Game reward") => {
    if (!auth.currentUser) return;
    const next = Math.max(0, (userData?.points || 0) + amount);
    await setDoc(userRef(auth.currentUser.uid), { points: next }, { merge: true });
    setUserData((p) => ({ ...(p || {}), points: next }));

    // (optional) transaction record
    const txRef = collection(db, "transactions");
    await setDoc(doc(txRef), {
      userId: auth.currentUser.uid,
      type: "earn",
      points: amount,
      balance: next,
      reason,
      createdAt: serverTimestamp(),
    });
    return next;
  };

  const deductPoints = async (amount, reason = "Redemption") => {
    if (!auth.currentUser) return;
    const curr = userData?.points || 0;
    if (curr < amount) throw new Error("Insufficient points");

    const next = curr - amount;
    await setDoc(userRef(auth.currentUser.uid), { points: next }, { merge: true });
    setUserData((p) => ({ ...(p || {}), points: next }));

    // (optional) transaction record
    const txRef = collection(db, "transactions");
    await setDoc(doc(txRef), {
      userId: auth.currentUser.uid,
      type: "spend",
      points: amount,
      balance: next,
      reason,
      createdAt: serverTimestamp(),
    });
    return next;
  };

  const getUserDocument = async (uid) => {
    if (!uid) return null;
    const snap = await getDoc(userRef(uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  };

  const getUserTransactions = async (limitCount = 10) => {
    if (!auth.currentUser) return [];
    const txRef = collection(db, "transactions");
    const q = query(txRef, where("userId", "==", auth.currentUser.uid), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.slice(0, limitCount).map((d) => ({ id: d.id, ...d.data() }));
  };

  const clearError = () => setAuthError(null);

  // ---------- Auth subscription ----------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await loadUserProfile(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({
    currentUser,
    userData,
    isAdmin: !!userData?.isAdmin,
    authError,
    loading,

    // auth
    signup,
    login,
    loginAdminOnly,
    googleSignIn,
    resetPassword,
    logout,

    // profile
    updateUserProfile: updateUserProfileSafe,
    updateUserData,

    // points
    addPoints,
    deductPoints,

    // misc
    createUserDocument,
    getUserDocument,
    getUserTransactions,
    clearError,
  }), [currentUser, userData, authError, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
