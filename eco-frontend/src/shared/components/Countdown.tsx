import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface CountdownProps {
  expiresAt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Countdown = ({ expiresAt, className, size = 'md' }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const distance = expiryTime - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        setIsExpired(true);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Set urgent if less than 1 hour
      setIsUrgent(hours < 1);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1.5',
    lg: 'text-base gap-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center font-semibold',
        sizeClasses[size],
        isExpired && 'text-muted-foreground',
        isUrgent && !isExpired && 'text-destructive countdown-pulse',
        !isUrgent && !isExpired && 'text-eco',
        className
      )}
    >
      <Clock className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
      <span>{timeLeft}</span>
    </div>
  );
};
