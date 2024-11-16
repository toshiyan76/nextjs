import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`border rounded-lg p-4 shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};