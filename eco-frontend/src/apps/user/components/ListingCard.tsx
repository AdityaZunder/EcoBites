import { Listing, Restaurant } from '@/shared/types';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Countdown } from '@/shared/components/Countdown';
import { Bookmark, MapPin, Star, ShoppingCart, Clock, Lock as LockIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '@/shared/contexts/CartContext';
import { useToast } from '@/shared/hooks/use-toast';
import { DailyLimitDialog } from '@/apps/user/components/premium/DailyLimitDialog';
import { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { isPremiumActive } from '@/shared/lib/premiumUtils';
import { usePremiumModal } from '@/shared/contexts/PremiumModalContext';

interface ListingCardProps {
  listing: Listing;
  restaurant?: Restaurant;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  className?: string;
}

export const ListingCard = ({
  listing,
  restaurant,
  onBookmark,
  isBookmarked,
  className
}: ListingCardProps) => {
  const { user } = useAuth();
  const { addItem, dailyItemsCount, dailyItemLimit } = useCart();
  const { toast } = useToast();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const { openModal } = usePremiumModal();

  const discountPercent = Math.round(
    ((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100
  );

  const isLowStock = listing.remainingQuantity < 5;
  const isExpired = new Date(listing.expiresAt) < new Date();

  // Check if this is a locked priority deal
  const isLocked = listing.isPriorityAccess && !isPremiumActive(user);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLocked) {
      openModal();
      return;
    }

    const success = addItem({ ...listing, restaurant });
    if (!success) {
      // Daily limit reached
      setShowLimitDialog(true);
      return;
    }

    toast({
      title: 'Added to cart!',
      description: `${listing.title} has been added to your cart.`,
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      openModal();
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className={cn(
          'group relative overflow-hidden border-border/50 bg-card transition-all duration-300',
          !isLocked && 'hover:shadow-premium-hover hover:-translate-y-1',
          isExpired && 'opacity-75 grayscale',
          isLocked && 'cursor-pointer',
          className
        )}
      >
        <Link to={isLocked ? '#' : `/listing/${listing.id}`} className="block" onClick={isLocked ? (e) => e.preventDefault() : undefined}>
          <div className="relative aspect-[4/3] overflow-hidden">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className={cn(
                  "object-cover w-full h-full transition-transform duration-500",
                  !isLocked && "group-hover:scale-110",
                  isLocked && "blur-[2px]"
                )}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                No image
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className={cn("absolute top-3 left-3 flex flex-col gap-2", isLocked && "opacity-50")}>
              <Badge className="bg-destructive text-destructive-foreground font-bold shadow-sm">
                -{discountPercent}%
              </Badge>
              {isLowStock && !isExpired && (
                <Badge variant="secondary" className="font-medium shadow-sm">
                  Only {listing.remainingQuantity} left
                </Badge>
              )}
            </div>

            {listing.isPriorityAccess && !isLocked && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-amber-400 text-amber-950 font-semibold shadow-sm backdrop-blur-md">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Priority
                </Badge>
              </div>
            )}

            {/* Locked Overlay */}
            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[3px] z-10">
                <div className="bg-background/80 backdrop-blur-md p-3 rounded-full shadow-lg mb-2">
                  <LockIcon className="h-6 w-6 text-primary" />
                </div>
                <Badge className="bg-primary text-primary-foreground font-bold shadow-lg">
                  Premium Deal
                </Badge>
              </div>
            )}
          </div>
        </Link>

        <div className={cn("p-5 space-y-4", isLocked && "flex flex-col items-center justify-center text-center py-8")}>
          {!isLocked ? (
            <>
              <div className="space-y-2">
                {restaurant && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{restaurant.name}</span>
                  </div>
                )}

                <Link to={`/listing/${listing.id}`}>
                  <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {listing.title}
                  </h3>
                </Link>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {listing.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs font-normal bg-muted/50 border-transparent">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-border/50 pt-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ${listing.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                      ${listing.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <Countdown expiresAt={listing.expiresAt} size="sm" />
                  </div>
                </div>

                <div className="flex gap-2">
                  {onBookmark && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        onBookmark();
                      }}
                      className={cn(
                        'h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors',
                        isBookmarked && 'text-primary fill-current'
                      )}
                    >
                      <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
                    </Button>
                  )}

                  <Button
                    size="icon"
                    onClick={handleAddToCart}
                    disabled={isExpired || listing.remainingQuantity === 0}
                    className="h-10 w-10 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Ends in</p>
              <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <Clock className="h-5 w-5" />
                <Countdown expiresAt={listing.expiresAt} size="md" />
              </div>
            </div>
          )}
        </div>

        <DailyLimitDialog
          open={showLimitDialog}
          onClose={() => setShowLimitDialog(false)}
          currentCount={dailyItemsCount}
          limit={dailyItemLimit}
        />
      </Card>
    </>
  );
};
