import React from 'react';
export const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50',
    ghost: 'text-cyan-600 hover:bg-cyan-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
