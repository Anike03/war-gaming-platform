import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  return context;
};

// Admin-specific hooks
export const useAdminData = () => {
  const { users, redemptions, stats, loading } = useAdmin();
  return { users, redemptions, stats, loading };
};

export const useAdminActions = () => {
  const { 
    getAllUsers, 
    updateUser, 
    adjustUserPoints, 
    banUser, 
    unbanUser, 
    deleteUser,
    getRedemptions,
    updateRedemptionStatus,
    getStats
  } = useAdmin();
  
  return {
    getAllUsers, 
    updateUser, 
    adjustUserPoints, 
    banUser, 
    unbanUser, 
    deleteUser,
    getRedemptions,
    updateRedemptionStatus,
    getStats
  };
};

export const useGiftCardValues = () => {
  const { GIFT_CARD_VALUES } = useAdmin();
  return GIFT_CARD_VALUES;
};