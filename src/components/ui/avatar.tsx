import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar', 
  className = '' 
}) => {
  return (
    <div className={`rounded-full overflow-hidden w-10 h-10 ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          ?
        </div>
      )}
    </div>
  );
};