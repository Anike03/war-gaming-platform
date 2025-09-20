// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail // Added this import
} from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Admin credentials
  const ADMIN_EMAIL = "aniketsharma9360@gmail.com";
  const ADMIN_PASSWORD = "admin@aniket#00";

  // Add password reset function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function signup(email, password, additionalData = {}) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return createUserDocument(userCredential.user, additionalData);
      })
      .catch((error) => {
        setAuthError(error.message);
        throw error;
      });
  }

  function login(email, password) {
    setAuthError(null);
    // Handle admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
          setAuthError(error.message);
          throw error;
        });
    }
    
    return signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setAuthError(error.message);
        throw error;
      });
  }

  function googleSignIn() {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        return createUserDocument(result.user, {
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });
      })
      .catch((error) => {
        setAuthError(error.message);
        throw error;
      });
  }

  function logout() {
    setAuthError(null);
    return signOut(auth)
      .catch((error) => {
        setAuthError(error.message);
        throw error;
      });
  }

  function updateUserProfile(updates) {
    return updateProfile(auth.currentUser, updates)
      .catch((error) => {
        setAuthError(error.message);
        throw error;
      });
  }

  async function updateUserData(updates) {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updates);
      
      // Update local user data
      setUserData(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error updating user document:', error);
      setAuthError(error.message);
      throw error;
    }
  }

  async function addPoints(points, reason = "Game reward") {
    if (!currentUser) return;
    
    try {
      // Update user points
      const newPoints = (userData?.points || 0) + points;
      await updateUserData({ points: newPoints });
      
      // Create transaction record
      const transactionsRef = collection(db, 'transactions');
      await setDoc(doc(transactionsRef), {
        userId: currentUser.uid,
        type: 'earn',
        points: points,
        balance: newPoints,
        reason: reason,
        createdAt: new Date()
      });
      
      return newPoints;
    } catch (error) {
      console.error('Error adding points:', error);
      setAuthError(error.message);
      throw error;
    }
  }

  async function deductPoints(points, reason = "Redemption") {
    if (!currentUser) return;
    
    try {
      const currentPoints = userData?.points || 0;
      if (currentPoints < points) {
        throw new Error("Insufficient points");
      }
      
      const newPoints = currentPoints - points;
      await updateUserData({ points: newPoints });
      
      // Create transaction record
      const transactionsRef = collection(db, 'transactions');
      await setDoc(doc(transactionsRef), {
        userId: currentUser.uid,
        type: 'spend',
        points: points,
        balance: newPoints,
        reason: reason,
        createdAt: new Date()
      });
      
      return newPoints;
    } catch (error) {
      console.error('Error deducting points:', error);
      setAuthError(error.message);
      throw error;
    }
  }

  async function createUserDocument(user, additionalData = {}) {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    
    try {
      const snapshot = await getDoc(userRef);
      
      if (!snapshot.exists()) {
        const { email } = user;
        const createdAt = new Date();
        const isAdmin = email === ADMIN_EMAIL;
        
        try {
          await setDoc(userRef, {
            email,
            createdAt,
            points: 0,
            isAdmin,
            displayName: additionalData.displayName || email.split('@')[0],
            photoURL: additionalData.photoURL || null,
            status: 'active',
            ...additionalData
          });
        } catch (error) {
          console.error('Error creating user document:', error);
          setAuthError(error.message);
        }
      }
      
      return getUserDocument(user.uid);
    } catch (error) {
      console.error('Error accessing user document:', error);
      setAuthError(error.message);
      return null;
    }
  }

  async function getUserDocument(uid) {
    if (!uid) return null;
    
    try {
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user document:', error);
      setAuthError(error.message);
      return null;
    }
  }

  async function getUserTransactions(limit = 10) {
    if (!currentUser) return [];
    
    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef, 
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting transactions:', error);
      setAuthError(error.message);
      return [];
    }
  }

  // Clear error function
  const clearError = () => {
    setAuthError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          let userDoc = await getUserDocument(user.uid);
          
          if (!userDoc) {
            userDoc = await createUserDocument(user, {
              displayName: user.displayName,
              photoURL: user.photoURL
            });
          }
          
          setUserData(userDoc);
        } catch (error) {
          console.error('Error loading user data:', error);
          setAuthError(error.message);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    authError,
    signup,
    login,
    googleSignIn,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserData,
    addPoints,
    deductPoints,
    createUserDocument,
    getUserDocument,
    getUserTransactions,
    clearError,
    isAdmin: userData?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}