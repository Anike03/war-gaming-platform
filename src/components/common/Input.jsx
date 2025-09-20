import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  size = 'medium',
  className = '',
  ...props
}) => {
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg'
  };

  const inputClasses = `
    w-full border border-border-color rounded-lg bg-card text-primary placeholder-muted
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${Icon ? 'pl-10' : sizes[size]}
    ${error ? 'border-danger focus:ring-danger' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-muted" />
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
      </div>

      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-danger' : 'text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;