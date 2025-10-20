// src/hooks/useAuth.js
// Use the hook that AuthContext already exports.
import { useAuth as useAuthContext } from "../context/AuthContext";

export const useAuth = () => useAuthContext();

// Handy selectors
export const useUserData = () => {
  const { userData } = useAuthContext();
  return userData;
};

export const useIsAdmin = () => {
  const { isAdmin } = useAuthContext();
  return isAdmin;
};

export const usePoints = () => {
  const { userData, addPoints, deductPoints } = useAuthContext();
  return {
    points: userData?.points || 0,
    addPoints,
    deductPoints,
  };
};

// Actions (include admin + reset password)
export const useAuthActions = () => {
  const {
    login,
    signup,
    loginAdminOnly,   
    googleSignIn,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserData,
  } = useAuthContext();

  return {
    login,
    signup,
    loginAdminOnly,
    googleSignIn,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserData,
  };
};
