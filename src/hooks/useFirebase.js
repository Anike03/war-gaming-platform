import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  startAfter, // ✅ Added missing import
  limit
} from 'firebase/firestore';
import { db } from '../utils/firebase';

// Generic hook for fetching a collection
export const useCollection = (collectionName, conditions = [], orderByField = null, resultLimit = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    let q = collection(db, collectionName);
    
    // Apply conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField.field, orderByField.direction || 'asc'));
    }
    
    // Apply limit
    if (resultLimit) {
      q = query(q, limit(resultLimit));
    }
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(newData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error(`Error in useCollection for ${collectionName}:`, err);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(conditions), orderByField, resultLimit]);

  return { data, loading, error };
};

// Hook for fetching a single document
export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    const docRef = doc(db, collectionName, docId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({
            id: snapshot.id,
            ...snapshot.data()
          });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error(`Error in useDocument for ${collectionName}/${docId}:`, err);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
};

// Hook for CRUD operations
export const useFirestoreCRUD = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date()
      });
      setLoading(false);
      return { id: docRef.id, ...data };
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(`Error creating document in ${collectionName}:`, err);
      throw err;
    }
  };

  const update = async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      setLoading(false);
      return { id, ...data };
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(`Error updating document ${id} in ${collectionName}:`, err);
      throw err;
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteDoc(doc(db, collectionName, id));
      setLoading(false);
      return id;
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(`Error deleting document ${id} from ${collectionName}:`, err);
      throw err;
    }
  };

  return { create, update, remove, loading, error };
};

// Hook for user-specific data
export const useUserCollection = (collectionName, userId, conditions = [], orderByField = null, resultLimit = null) => {
  const userConditions = userId ? [
    { field: 'userId', operator: '==', value: userId },
    ...conditions
  ] : conditions;
  
  return useCollection(collectionName, userConditions, orderByField, resultLimit);
};

// Hook for real-time user data
export const useRealtimeUserData = (userId) => {
  const { data: user, loading: userLoading, error: userError } = useDocument('users', userId);
  
  const { data: transactions, loading: transactionsLoading, error: transactionsError } = useUserCollection(
    'transactions', 
    userId, 
    [],
    { field: 'createdAt', direction: 'desc' },
    10
  );
  
  const { data: games, loading: gamesLoading, error: gamesError } = useUserCollection(
    'games', 
    userId, 
    [],
    { field: 'createdAt', direction: 'desc' },
    10
  );
  
  const { data: redemptions, loading: redemptionsLoading, error: redemptionsError } = useUserCollection(
    'redemptions', 
    userId, 
    [],
    { field: 'createdAt', direction: 'desc' },
    10
  );
  
  const loading = userLoading || transactionsLoading || gamesLoading || redemptionsLoading;
  const error = userError || transactionsError || gamesError || redemptionsError;
  
  return {
    user,
    transactions,
    games,
    redemptions,
    loading,
    error
  };
};

// Hook for paginated data
export const usePaginatedCollection = (collectionName, conditions = [], orderByField = null, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      let q = query(
        collection(db, collectionName),
        ...conditions.map(cond => where(cond.field, cond.operator, cond.value)),
        orderBy(orderByField.field, orderByField.direction || 'asc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc)); // ✅ Fixed: using imported startAfter
      }
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const newData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setData(prev => [...prev, ...newData]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === pageSize);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(`Error in usePaginatedCollection for ${collectionName}:`, err);
    }
  };

  const refresh = () => {
    setData([]);
    setLastDoc(null);
    setHasMore(true);
    loadMore();
  };

  useEffect(() => {
    refresh();
  }, [collectionName, JSON.stringify(conditions), orderByField, pageSize]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};

// Hook for search functionality
export const useSearch = (collectionName, searchField, searchTerm) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // For Firestore, we need to use a workaround for search since it doesn't support native text search
      // This is a simple prefix-based search
      const end = term.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
      
      const q = query(
        collection(db, collectionName),
        where(searchField, '>=', term),
        where(searchField, '<', end),
        limit(10)
      );
      
      const snapshot = await getDocs(q);
      const searchResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setResults(searchResults);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(`Error searching ${collectionName} for ${searchTerm}:`, err);
    }
  };

  return {
    results,
    loading,
    error,
    search
  };
};