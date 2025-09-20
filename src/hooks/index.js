// Export all hooks from a single file for easier imports

// Auth hooks
export { useAuth, useUserData, useIsAdmin, usePoints, useAuthActions } from './useAuth';

// Game hooks
export { useGame, useGameState, useGameActions, useLeaderboard, useGameHistory, usePointsSystem } from './useGame';

// Admin hooks
export { useAdmin, useAdminData, useAdminActions, useGiftCardValues } from './useAdmin';

// Redemption hooks
export { useRedemption, useRedemptionData, useRedemptionActions } from './useRedemption';

// Firebase hooks
export { 
  useCollection, 
  useDocument, 
  useFirestoreCRUD, 
  useUserCollection, 
  useRealtimeUserData 
} from './useFirebase';

// Local storage hooks
export { 
  useLocalStorage, 
  useGamePreferences, 
  useGameProgress 
} from './useLocalStorage';

// UI hooks
export { 
  useModal, 
  useLoading, 
  useNotifications, 
  useTheme 
} from './useUI';

// Game logic hooks
export { 
  useGameTimer, 
  useGameScore, 
  useGameCompletion, 
  useGameDifficulty 
} from './useGameLogic';