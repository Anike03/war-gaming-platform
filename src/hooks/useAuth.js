import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Additional auth-related hooks
export const useUserData = () => {
  const { userData } = useAuth();
  return userData;
};

export const useIsAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin;
};

export const usePoints = () => {
  const { userData, addPoints, deductPoints } = useAuth();
  return {
    points: userData?.points || 0,
    addPoints,
    deductPoints
  };
};

export const useAuthActions = () => {
  const { login, signup, googleSignIn, logout, updateUserProfile, updateUserData } = useAuth();
  return {
    login,
    signup,
    googleSignIn,
    logout,
    updateUserProfile,
    updateUserData
  };
};