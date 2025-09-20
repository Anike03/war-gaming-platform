// AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../utils/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  getDoc 
} from 'firebase/firestore';

export const AdminContext = createContext(); // Added export

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    totalRedemptions: 0,
    pendingRedemptions: 0
  });
  const { isAdmin } = useAuth();

  // Gift card values
  const GIFT_CARD_VALUES = {
    10000: 10,
    20000: 20,
    30000: 30
  };

  const getAllUsers = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersList = [];
      
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      
      setUsers(usersList);
      return usersList;
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updates) => {
    if (!isAdmin) return;
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updates);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const adjustUserPoints = async (userId, points, reason = "Admin adjustment") => {
    if (!isAdmin) return;
    
    try {
      const userRef = doc(db, 'users', userId);
      const user = users.find(u => u.id === userId);
      
      if (!user) throw new Error("User not found");
      
      const newPoints = (user.points || 0) + points;
      await updateDoc(userRef, { points: newPoints });
      
      // Create transaction record
      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, {
        userId,
        type: points > 0 ? 'admin_add' : 'admin_deduct',
        points: Math.abs(points),
        balance: newPoints,
        reason,
        adminId: "system",
        createdAt: new Date()
      });
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, points: newPoints } : u
      ));
      
      return newPoints;
    } catch (error) {
      console.error('Error adjusting user points:', error);
      throw error;
    }
  };

  const banUser = async (userId, reason = "Violation of terms") => {
    return updateUser(userId, { 
      status: 'banned',
      banReason: reason,
      bannedAt: new Date()
    });
  };

  const unbanUser = async (userId) => {
    return updateUser(userId, { 
      status: 'active',
      banReason: null,
      bannedAt: null
    });
  };

  const deleteUser = async (userId) => {
    if (!isAdmin) return;
    
    try {
      // Note: In a real app, you might want to anonymize data instead of deleting
      await deleteDoc(doc(db, 'users', userId));
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const getRedemptions = async (status = null) => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      let q = query(collection(db, 'redemptions'), orderBy('createdAt', 'desc'));
      
      if (status) {
        q = query(q, where('status', '==', status));
      }
      
      const querySnapshot = await getDocs(q);
      const redemptionsList = [];
      
      querySnapshot.forEach((doc) => {
        redemptionsList.push({ id: doc.id, ...doc.data() });
      });
      
      // Get user data for each redemption
      const redemptionsWithUsers = await Promise.all(
        redemptionsList.map(async (redemption) => {
          const userRef = doc(db, 'users', redemption.userId);
          const userSnap = await getDoc(userRef);
          
          return {
            ...redemption,
            user: userSnap.exists() ? userSnap.data() : { displayName: 'Unknown User' }
          };
        })
      );
      
      setRedemptions(redemptionsWithUsers);
      return redemptionsWithUsers;
    } catch (error) {
      console.error('Error getting redemptions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateRedemptionStatus = async (redemptionId, status, giftCardCode = null) => {
    if (!isAdmin) return;
    
    try {
      const redemptionRef = doc(db, 'redemptions', redemptionId);
      const updates = { 
        status, 
        processedAt: status === 'approved' ? new Date() : null 
      };
      
      if (giftCardCode) {
        updates.giftCardCode = giftCardCode;
      }
      
      await updateDoc(redemptionRef, updates);
      
      // Update local state
      setRedemptions(prev => prev.map(r => 
        r.id === redemptionId ? { ...r, ...updates } : r
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating redemption status:', error);
      throw error;
    }
  };

  const getStats = async () => {
    if (!isAdmin) return;
    
    try {
      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      
      // Calculate total points
      let totalPoints = 0;
      usersSnapshot.forEach(doc => {
        totalPoints += doc.data().points || 0;
      });
      
      // Get redemption stats
      const redemptionsSnapshot = await getDocs(collection(db, 'redemptions'));
      const totalRedemptions = redemptionsSnapshot.size;
      
      const pendingRedemptions = redemptionsSnapshot.docs.filter(
        doc => doc.data().status === 'pending'
      ).length;
      
      const newStats = {
        totalUsers,
        totalPoints,
        totalRedemptions,
        pendingRedemptions
      };
      
      setStats(newStats);
      return newStats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return stats;
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getAllUsers();
      getRedemptions();
      getStats();
      
      // Set up real-time listeners in a real app
      // For now, we'll refresh data every 30 seconds
      const interval = setInterval(() => {
        getStats();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const value = {
    users,
    redemptions,
    loading,
    stats,
    getAllUsers,
    updateUser,
    adjustUserPoints,
    banUser,
    unbanUser,
    deleteUser,
    getRedemptions,
    updateRedemptionStatus,
    getStats,
    GIFT_CARD_VALUES
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}