import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback, 
  status,
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };

  const statusColors = {
    active: 'bg-success',
    inactive: 'bg-surface-400',
    'on-leave': 'bg-warning',
    away: 'bg-warning'
  };

  const showFallback = !src || imageError || !imageLoaded;

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          ${sizes[size]} 
          rounded-full overflow-hidden bg-surface-200 flex items-center justify-center
          ${showFallback ? 'bg-gradient-to-br from-primary to-blue-600 text-white font-medium' : ''}
        `}
        {...props}
      >
        {!showFallback ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {fallback ? (
              <span className="font-medium">{getInitials(fallback)}</span>
            ) : (
              <ApperIcon name="User" size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 28} />
            )}
          </>
        )}
      </motion.div>

      {/* Status Indicator */}
      {status && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} 
            rounded-full border-2 border-white
            ${statusColors[status] || statusColors.inactive}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;