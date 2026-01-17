import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: number;
  className?: string;
}

export function CircleLoader({ size = 24, className = '' }: LoaderProps) {
  return (
    <Loader
      className={cn('animate-spin text-primary', className)}
      size={size}
    />
  );
}