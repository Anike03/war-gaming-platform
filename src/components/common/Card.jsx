import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'medium',
  variant = 'default'
}) => {
  const baseClasses = 'rounded-lg border transition-all';
  
  const variants = {
    default: 'bg-card border-border-color',
    elevated: 'bg-card border-border-color shadow-md',
    primary: 'bg-primary/10 border-primary/20',
    success: 'bg-success/10 border-success/20',
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-danger/10 border-danger/20'
  };

  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:transform hover:-translate-y-1' : '';

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverClasses}
    ${className}
  `;

  return <div className={classes}>{children}</div>;
};

export default Card;