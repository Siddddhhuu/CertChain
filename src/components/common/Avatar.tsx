import React from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };
  
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  const avatarClass = `${sizeClasses[size]} inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-100 ${className}`;
  
  // Generate a consistent background color based on the name
  const getColorFromName = (name: string) => {
    if (!name) return 'bg-gray-200';
    
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-pink-100 text-pink-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800',
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  if (src) {
    return (
      <div className={avatarClass}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }
  
  return (
    <div className={`${avatarClass} ${name ? getColorFromName(name) : 'bg-gray-200'} font-medium`}>
      {name ? getInitials(name) : '?'}
    </div>
  );
};

export default Avatar;