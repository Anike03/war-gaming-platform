import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: 'bg-success/90 text-white',
    error: 'bg-danger/90 text-white',
    warning: 'bg-warning/90 text-dark',
    info: 'bg-primary/90 text-white'
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-lg transform transition-all ${styles[type]}`}>
      <div className="flex items-center p-4">
        <Icon size={20} className="flex-shrink-0" />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;