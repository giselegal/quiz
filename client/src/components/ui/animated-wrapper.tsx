
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation?: 'fade' | 'scale' | 'slide' | 'none';
  show?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animation = 'fade',
  show = true,
  duration = 300,
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, delay]);

  if (animation === 'none') {
    return <div className={className}>{children}</div>;
  }

  const getAnimationClasses = () => {
    switch (animation) {
      case 'fade':
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
      case 'scale':
        return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
      case 'slide':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4';
      default:
        return isVisible ? 'opacity-100' : 'opacity-0';
    }
  };

  return (
    <div
      className={cn(
        'transition-all ease-out',
        getAnimationClasses(),
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};
