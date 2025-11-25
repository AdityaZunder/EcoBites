import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useCart } from '@/shared/contexts/CartContext';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { Countdown } from '@/shared/components/Countdown';
import { mockListings, mockRestaurants } from '@/shared/lib/mockData';
import { Listing, Restaurant } from '@/shared/types';
import { ArrowLeft, MapPin, Clock, Star, ShoppingCart, Share2, Heart } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { SkeletonLoader } from '@/shared/components/common/SkeletonLoader';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      const found = mockListings.find(l => l.id === id);
      if (!found) {
        navigate('/deals');
        return;
      }

      setListing(found);
      const rest = mockRestaurants.find(r => r.id === found.restaurantId);
      setRestaurant(rest || null);
      setLoading(false);
    }, 600);
  }, [id, user, navigate]);

  const handleOrder = () => {
    if (!listing || !restaurant) return;

    addItem({ ...listing, restaurant });

    toast({
      title: 'Added to Cart! 🛒',
      description: `${listing.title} has been added to your cart.`,
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <SkeletonLoader count={1} className="h-10 w-24 mb-4" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <SkeletonLoader count={1} className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <SkeletonLoader count={1} className="h-12 w-3/4" />
            <SkeletonLoader count={1} className="h-24 w-full" />
            <SkeletonLoader count={3} className="h-6 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing || !restaurant) return null;

  const discountPercent = Math.round(
    ((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100
  );

  const isExpired = new Date(listing.expiresAt) < new Date();
  const isSoldOut = listing.remainingQuantity === 0;
  const canOrder = !isExpired && !isSoldOut;

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-muted/50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Deals
      </Button>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section */}
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-muted shadow-premium group">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}

          <div className="absolute top-4 left-4">
            <Badge className="bg-destructive text-destructive-foreground font-bold px-4 py-2 text-lg shadow-lg">
              -{discountPercent}% OFF
            </Badge>
          </div>

          {listing.isPriorityAccess && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-amber-400 text-amber-950 font-semibold px-3 py-1 shadow-lg backdrop-blur-md border-none">
                <Star className="h-4 w-4 mr-1 fill-current" />
                Priority
              </Badge>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">{listing.title}</h1>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Restaurant Info Card */}
          <Card className="p-4 flex items-center gap-4 bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="h-16 w-16 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {restaurant.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{restaurant.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <Badge variant="outline" className="font-semibold bg-background">
                <Star className="h-3.5 w-3.5 mr-1 fill-amber-400 text-amber-400" />
                {restaurant.rating}
              </Badge>
            </div>
          </Card>

          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {listing.description}
            </p>

            {/* Price & Timer */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-bold text-primary">
                      ${listing.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through decoration-destructive/30">
                      ${listing.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                  <Countdown expiresAt={listing.expiresAt} size="lg" />
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Availability:</span>
                  <Badge variant={listing.remainingQuantity < 5 ? "destructive" : "secondary"}>
                    {listing.remainingQuantity} left
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Pickup by 10:00 PM</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all"
                disabled={!canOrder}
                onClick={handleOrder}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isExpired ? 'Deal Expired' : isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
