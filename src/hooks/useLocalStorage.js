import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook for storing game preferences
export const useGamePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('gamePreferences', {
    sound: true,
    music: false,
    volume: 0.7,
    difficulty: 'medium',
    theme: 'dark',
    notifications: true,
    language: 'en'
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      sound: true,
      music: false,
      volume: 0.7,
      difficulty: 'medium',
      theme: 'dark',
      notifications: true,
      language: 'en'
    });
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
    setPreferences
  };
};

// Hook for storing game progress
export const useGameProgress = (gameId) => {
  const [progress, setProgress] = useLocalStorage(`gameProgress_${gameId}`, {
    level: 1,
    score: 0,
    completed: false,
    achievements: [],
    bestTime: null,
    bestScore: 0,
    attempts: 0,
    lastPlayed: null
  });

  const updateProgress = (updates) => {
    setProgress(prev => ({
      ...prev,
      ...updates,
      lastPlayed: new Date().toISOString()
    }));
  };

  const resetProgress = () => {
    setProgress({
      level: 1,
      score: 0,
      completed: false,
      achievements: [],
      bestTime: null,
      bestScore: 0,
      attempts: 0,
      lastPlayed: new Date().toISOString()
    });
  };

  const unlockAchievement = (achievementId) => {
    setProgress(prev => {
      if (prev.achievements.includes(achievementId)) {
        return prev;
      }
      
      return {
        ...prev,
        achievements: [...prev.achievements, achievementId]
      };
    });
  };

  return {
    progress,
    updateProgress,
    resetProgress,
    unlockAchievement
  };
};

// Hook for storing session data
export const useSessionStorage = (key, initialValue) => {
  // Get from session storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};