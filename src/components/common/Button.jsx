import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary-dark hover:to-secondary-dark focus:ring-primary',
    secondary: 'bg-transparent border-2 border-secondary text-secondary hover:bg-secondary/10 focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent',
    success: 'bg-success text-white hover:bg-success-dark focus:ring-success',
    warning: 'bg-warning text-dark hover:bg-warning-dark focus:ring-warning',
    danger: 'bg-danger text-white hover:bg-danger-dark focus:ring-danger',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={size === 'small' ? 16 : 20} className="mr-2" />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon size={size === 'small' ? 16 : 20} className="ml-2" />
      )}
    </button>
  );
};

export default Button;