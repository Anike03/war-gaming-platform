import React, { useEffect, useState } from 'react';
import Confetti from 'canvas-confetti';

const ConfettiAnimation = ({ 
  active = false, 
  config = {} 
}) => {
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    if (isActive) {
      const end = Date.now() + (config.duration || 3000);
      const colors = config.colors || ['#6a11cb', '#2575fc', '#ff4e50', '#28a745', '#ffc107'];

      const frame = () => {
        Confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });

        Confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Cleanup after animation completes
      const timer = setTimeout(() => {
        setIsActive(false);
      }, config.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive, config]);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  return null;
};

export default ConfettiAnimation;