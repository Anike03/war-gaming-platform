import { useContext } from 'react';
import { RedemptionContext } from '../context/RedemptionContext';

export const useRedemption = () => {
  const context = useContext(RedemptionContext);
  
  if (!context) {
    throw new Error('useRedemption must be used within a RedemptionProvider');
  }
  
  return context;
};

// Redemption-specific hooks
export const useRedemptionData = () => {
  const { redemptionHistory, loading, GIFT_CARD_OPTIONS } = useRedemption();
  return { redemptionHistory, loading, GIFT_CARD_OPTIONS };
};

export const useRedemptionActions = () => {
  const { requestRedemption, getRedemptionHistory } = useRedemption();
  return { requestRedemption, getRedemptionHistory };
};