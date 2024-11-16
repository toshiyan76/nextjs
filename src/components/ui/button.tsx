"use client"

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  children, 
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-blue-500 text-white',
    outline: 'border border-blue-500 text-blue-500',
  };

  return (
    <button 
      className={`px-4 py-2 rounded ${variantClasses[variant]}`} 
      {...props}
    >
      {children}
    </button>
  );
};