import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationDotProps {
  count?: number;
  showCount?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NotificationDot({
  count = 0,
  showCount = false,
  className,
  size = 'md',
}: NotificationDotProps) {
  if (count === 0) return null;
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
  
  const countClasses = {
    sm: 'min-w-4 h-4 text-[9px]',
    md: 'min-w-5 h-5 text-[10px]',
    lg: 'min-w-6 h-6 text-xs',
  };
  
  // Si solo queremos mostrar un punto rojo (sin número)
  if (!showCount) {
    return (
      <div
        className={cn(
          'rounded-full bg-red-500',
          sizeClasses[size],
          className
        )}
      />
    );
  }
  
  // Si queremos mostrar el número de notificaciones
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-red-500 text-white font-bold',
        countClasses[size],
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
}