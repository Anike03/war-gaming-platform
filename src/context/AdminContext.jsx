// src/context/AdminContext.jsx
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
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

export const AdminContext = createContext();

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

  // Function to send email notification (mock implementation - integrate with your email service)
  const sendRedemptionNotification = async (redemption, status, giftCardCode = null, reason = '') => {
    // This is a mock implementation. Replace with your actual email service
    console.log(`Sending ${status} notification to ${redemption.userEmail}`, {
      userName: redemption.userName,
      vendor: redemption.vendor,
      value: redemption.value,
      status,
      giftCardCode,
      reason
    });
    
    // Example integration with email service:
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: redemption.userEmail,
    //     subject: `Redemption ${status} - ${redemption.vendor} $${redemption.value} Gift Card`,
    //     template: 'redemption-status',
    //     data: { redemption, status, giftCardCode, reason }
    //   })
    // });
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
        createdAt: serverTimestamp()
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
      bannedAt: serverTimestamp()
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

  const updateRedemptionStatus = async (redemptionId, status, giftCardCode = null, returnPoints = false, reason = '') => {
    if (!isAdmin) return;
    
    try {
      const redemptionRef = doc(db, 'redemptions', redemptionId);
      const redemption = redemptions.find(r => r.id === redemptionId);
      
      if (!redemption) throw new Error("Redemption not found");
      
      const updates = { 
        status, 
        statusReason: reason,
        updatedAt: serverTimestamp()
      };
      
      if (status === 'approved' && giftCardCode) {
        updates.giftCardCode = giftCardCode;
        updates.processedAt = serverTimestamp();
        updates.pointsReturned = false; // No points returned for approval
      }
      
      if (status === 'rejected') {
        updates.giftCardCode = null; // Clear gift card code for rejection
        updates.processedAt = serverTimestamp();
        if (returnPoints) {
          // Return points to user
          await adjustUserPoints(redemption.userId, redemption.points, `Points returned for rejected redemption: ${reason}`);
          updates.pointsReturned = true;
        } else {
          updates.pointsReturned = false;
        }
      }
      
      await updateDoc(redemptionRef, updates);
      
      // Send email notification
      await sendRedemptionNotification(redemption, status, giftCardCode, reason);
      
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

  // Additional admin functions for enhanced management

  const getUserRedemptionHistory = async (userId) => {
    if (!isAdmin) return;
    
    try {
      const redemptionsRef = collection(db, 'redemptions');
      const q = query(
        redemptionsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const userRedemptions = [];
      
      querySnapshot.forEach((doc) => {
        userRedemptions.push({ id: doc.id, ...doc.data() });
      });
      
      return userRedemptions;
    } catch (error) {
      console.error('Error getting user redemption history:', error);
      return [];
    }
  };

  const getUserTransactions = async (userId, limit = 50) => {
    if (!isAdmin) return;
    
    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactions = [];
      
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      
      return transactions.slice(0, limit);
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  };

  const bulkUpdateUsers = async (userIds, updates) => {
    if (!isAdmin) return;
    
    try {
      const promises = userIds.map(userId => updateUser(userId, updates));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  };

  const exportUserData = async (userId) => {
    if (!isAdmin) return;
    
    try {
      const [userData, userRedemptions, userTransactions] = await Promise.all([
        getUserDocument(userId),
        getUserRedemptionHistory(userId),
        getUserTransactions(userId)
      ]);
      
      return {
        user: userData,
        redemptions: userRedemptions,
        transactions: userTransactions
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  };

  const getUserDocument = async (userId) => {
    if (!isAdmin) return null;
    
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user document:', error);
      throw error;
    }
  };

  const searchUsers = async (searchTerm) => {
    if (!isAdmin) return;
    
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const allUsers = [];
      
      querySnapshot.forEach((doc) => {
        allUsers.push({ id: doc.id, ...doc.data() });
      });
      
      // Simple client-side search (for larger datasets, use Algolia or similar)
      const filteredUsers = allUsers.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return filteredUsers;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const getRedemptionAnalytics = async (period = 'month') => {
    if (!isAdmin) return;
    
    try {
      const redemptionsRef = collection(db, 'redemptions');
      const querySnapshot = await getDocs(redemptionsRef);
      const allRedemptions = [];
      
      querySnapshot.forEach((doc) => {
        allRedemptions.push({ id: doc.id, ...doc.data() });
      });
      
      // Calculate analytics
      const analytics = {
        total: allRedemptions.length,
        approved: allRedemptions.filter(r => r.status === 'approved').length,
        pending: allRedemptions.filter(r => r.status === 'pending').length,
        rejected: allRedemptions.filter(r => r.status === 'rejected').length,
        totalPointsRedeemed: allRedemptions.reduce((sum, r) => sum + (r.points || 0), 0),
        totalPointsReturned: allRedemptions
          .filter(r => r.status === 'rejected' && r.pointsReturned)
          .reduce((sum, r) => sum + (r.points || 0), 0),
        byVendor: {},
        byStatus: {}
      };
      
      // Group by vendor
      allRedemptions.forEach(redemption => {
        const vendor = redemption.vendor;
        if (!analytics.byVendor[vendor]) {
          analytics.byVendor[vendor] = {
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            totalPoints: 0
          };
        }
        analytics.byVendor[vendor].total++;
        analytics.byVendor[vendor][redemption.status]++;
        analytics.byVendor[vendor].totalPoints += redemption.points || 0;
      });
      
      return analytics;
    } catch (error) {
      console.error('Error getting redemption analytics:', error);
      return null;
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
    // Data
    users,
    redemptions,
    loading,
    stats,
    GIFT_CARD_VALUES,
    
    // User Management
    getAllUsers,
    updateUser,
    adjustUserPoints,
    banUser,
    unbanUser,
    deleteUser,
    getUserDocument,
    searchUsers,
    bulkUpdateUsers,
    exportUserData,
    
    // Redemption Management
    getRedemptions,
    updateRedemptionStatus,
    getUserRedemptionHistory,
    getRedemptionAnalytics,
    
    // Analytics & Stats
    getStats,
    getUserTransactions
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}