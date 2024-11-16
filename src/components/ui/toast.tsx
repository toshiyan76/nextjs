import React from 'react';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive';
}

export const toast = ({ 
  title, 
  description, 
  variant = 'default' 
}: ToastProps) => {
  console.log(`Toast: ${title} ${description ? `- ${description}` : ''} (${variant})`);
};