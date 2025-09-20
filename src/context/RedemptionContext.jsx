// RedemptionContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../utils/firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

export const RedemptionContext = createContext(); // Added export

export function useRedemption() {
  return useContext(RedemptionContext);
}

export function RedemptionProvider({ children }) {
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, userData, deductPoints } = useAuth();

  // Gift card options
  const GIFT_CARD_OPTIONS = [
    { points: 10000, value: 10, vendor: 'Starbucks' },
    { points: 10000, value: 10, vendor: 'Tim Hortons' },
    { points: 20000, value: 20, vendor: 'Starbucks' },
    { points: 20000, value: 20, vendor: 'Tim Hortons' },
    { points: 30000, value: 30, vendor: 'Starbucks' },
    { points: 30000, value: 30, vendor: 'Tim Hortons' }
  ];

  const requestRedemption = async (points, value, vendor) => {
    if (!currentUser || !userData) {
      throw new Error("You must be logged in to redeem points");
    }
    
    if (userData.points < points) {
      throw new Error("Insufficient points for this redemption");
    }
    
    setLoading(true);
    try {
      // First deduct points from user account
      await deductPoints(points, `Redemption request for ${vendor} $${value} gift card`);
      
      // Create redemption record
      const redemptionsRef = collection(db, 'redemptions');
      const docRef = await addDoc(redemptionsRef, {
        userId: currentUser.uid,
        points,
        value,
        vendor,
        status: 'pending',
        createdAt: new Date()
      });
      
      // Update local state
      const newRedemption = {
        id: docRef.id,
        userId: currentUser.uid,
        points,
        value,
        vendor,
        status: 'pending',
        createdAt: new Date()
      };
      
      setRedemptionHistory(prev => [newRedemption, ...prev]);
      
      return newRedemption;
    } catch (error) {
      console.error('Error creating redemption request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRedemptionHistory = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const redemptionsRef = collection(db, 'redemptions');
      const q = query(
        redemptionsRef, 
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      
      setRedemptionHistory(history);
      return history;
    } catch (error) {
      console.error('Error getting redemption history:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getRedemptionHistory();
    }
  }, [currentUser]);

  const value = {
    redemptionHistory,
    loading,
    GIFT_CARD_OPTIONS,
    requestRedemption,
    getRedemptionHistory
  };

  return (
    <RedemptionContext.Provider value={value}>
      {children}
    </RedemptionContext.Provider>
  );
}