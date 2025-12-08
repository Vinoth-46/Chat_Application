import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { User } from '../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', showStatus = false }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const statusColor = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500"
  };

  // Generate a reliable fallback URL using UI Avatars (initials)
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff`;

  // State to manage the current image source
  const [imgSrc, setImgSrc] = useState<string>(user.avatar || fallbackUrl);

  // Update image source if user prop changes
  useEffect(() => {
    setImgSrc(user.avatar || fallbackUrl);
  }, [user.avatar, user.username]);

  const handleError = () => {
    // If the primary avatar (e.g. DiceBear) fails to load, switch to fallback
    if (imgSrc !== fallbackUrl) {
      setImgSrc(fallbackUrl);
    }
  };

  return (
    <div className="relative inline-block">
      <img
        src={imgSrc}
        alt={user.username}
        className={clsx(
          "rounded-full object-cover border border-gray-100 bg-gray-100", 
          sizeClasses[size]
        )}
        onError={handleError}
      />
      {showStatus && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            statusColor[user.status],
            size === 'sm' ? "w-2 h-2" : "w-3 h-3"
          )}
        />
      )}
    </div>
  );
};