import React from 'react';
import { AuthProvider } from './AuthContext';
import { GameProvider } from './GameContext';
import { AdminProvider } from './AdminContext';
import { RedemptionProvider } from './RedemptionContext';

export function AllProviders({ children }) {
  return (
    <AuthProvider>
      <GameProvider>
        <AdminProvider>
          <RedemptionProvider>
            {children}
          </RedemptionProvider>
        </AdminProvider>
      </GameProvider>
    </AuthProvider>
  );
}

// Re-export all context hooks for easier imports
export { useAuth } from './AuthContext';
export { useGame } from './GameContext';
export { useAdmin } from './AdminContext';
export { useRedemption } from './RedemptionContext';