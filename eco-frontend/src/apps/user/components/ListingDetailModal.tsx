import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { Countdown } from '@/shared/components/Countdown';
import { Listing, Restaurant } from '@/shared/types';
import { MapPin, Clock, Star, ShoppingCart, Share2, Heart } from 'lucide-react';
import { useCart } from '@/shared/contexts/CartContext';
import { useToast } from '@/shared/hooks/use-toast';
import { PlaceholderMap } from '@/shared/components/common/PlaceholderMap';
import { useNavigate } from 'react-router-dom';

interface ListingDetailModalProps {
    listing: Listing | null;
    restaurant: Restaurant | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ListingDetailModal = ({ listing, restaurant, isOpen, onClose }: ListingDetailModalProps) => {
    const { addItem } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();

    if (!listing || !restaurant) return null;

    const discountPercent = Math.round(
        ((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100
    );

    const isExpired = new Date(listing.expiresAt) < new Date();
    const isSoldOut = listing.remainingQuantity === 0;
    const canOrder = !isExpired && !isSoldOut;

    const handleOrder = () => {
        const success = addItem({ ...listing, restaurant });

        if (success) {
            toast({
                title: 'Added to Cart! 🛒',
                description: `${listing.title} has been added to your cart.`,
            });
            onClose();
        } else {
            toast({
                title: 'Limit Reached',
                description: `You cannot add more of this item. Maximum available quantity reached.`,
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative aspect-square lg:aspect-auto lg:h-full bg-muted">
                        {listing.imageUrl ? (
                            <img
                                src={listing.imageUrl}
                                alt={listing.title}
                                className="object-cover w-full h-full"
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
                    <div className="p-6 lg:p-8 space-y-6">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{listing.title}</h2>
                                <div className="flex gap-2 shrink-0">
                                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                                        <Share2 className="h-4 w-4" />
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
                        <Card className="p-3 flex items-center gap-3 bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => { onClose(); navigate(`/restaurant/${restaurant.id}`); }}>
                            {restaurant.logo ? (
                                <img
                                    src={restaurant.logo}
                                    alt={restaurant.name}
                                    className="h-12 w-12 rounded-lg object-cover shadow-sm"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {restaurant.name.charAt(0)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base truncate">{restaurant.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{restaurant.address}</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <Badge variant="outline" className="font-semibold bg-background text-xs">
                                    <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                                    {restaurant.rating}
                                </Badge>
                            </div>
                        </Card>

                        {/* Map Location */}
                        <div className="h-32 rounded-xl overflow-hidden shadow-sm border border-border/50">
                            <PlaceholderMap label={restaurant.address} />
                        </div>

                        <div className="space-y-6">
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {listing.description}
                            </p>

                            {/* Price & Timer */}
                            <div className="p-4 rounded-xl bg-card border border-border shadow-sm space-y-4">
                                <div className="flex items-end justify-between flex-wrap gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-primary">
                                                ${listing.discountedPrice.toFixed(2)}
                                            </span>
                                            <span className="text-lg text-muted-foreground line-through decoration-destructive/30">
                                                ${listing.originalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                                        <Countdown expiresAt={listing.expiresAt} size="md" />
                                    </div>
                                </div>

                                <div className="h-px bg-border" />

                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-muted-foreground">Availability:</span>
                                        <Badge variant={listing.remainingQuantity < 5 ? "destructive" : "secondary"} className="text-xs">
                                            {listing.remainingQuantity} left
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Pickup by 10:00 PM</span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full h-12 text-base font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all"
                                    disabled={!canOrder}
                                    onClick={handleOrder}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    {isExpired ? 'Deal Expired' : isSoldOut ? 'Sold Out' : 'Add to Cart'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
