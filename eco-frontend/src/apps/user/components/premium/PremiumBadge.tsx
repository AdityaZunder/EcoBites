import { Crown } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface PremiumBadgeProps {
    className?: string;
    variant?: 'compact' | 'full';
}

export const PremiumBadge = ({ className, variant = 'compact' }: PremiumBadgeProps) => {
    return (
        <Badge
            className={cn(
                'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white border-0 shadow-sm',
                className
            )}
        >
            <Crown className="h-3 w-3 mr-1 fill-current" />
            {variant === 'full' ? 'Premium Member' : 'Premium'}
        </Badge>
    );
};
