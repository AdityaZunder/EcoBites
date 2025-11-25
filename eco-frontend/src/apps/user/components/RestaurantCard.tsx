import { Restaurant } from '@/shared/types';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';

interface RestaurantCardProps {
    restaurant: Restaurant;
    className?: string;
}

export const RestaurantCard = ({ restaurant, className }: RestaurantCardProps) => {
    return (
        <Card className={cn(
            'group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-1',
            className
        )}>
            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                {/* Logo/Image */}
                <div className="shrink-0">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-muted border border-border/50">
                        {restaurant.logo ? (
                            <img
                                src={restaurant.logo}
                                alt={restaurant.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-secondary/20">
                                <span className="text-2xl font-bold text-primary/40">
                                    {restaurant.name.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-lg sm:text-xl leading-tight group-hover:text-primary transition-colors">
                                {restaurant.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{restaurant.address}</span>
                            </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0 font-semibold shadow-sm">
                            <Star className="h-3 w-3 mr-1 fill-current text-amber-500" />
                            {restaurant.rating}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                        <Badge variant="outline" className="text-xs bg-muted/50">
                            {restaurant.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto sm:ml-0">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Closes 10 PM</span>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button asChild size="sm" className="w-full sm:w-auto group/btn">
                            <Link to={`/restaurant/${restaurant.id}`}>
                                View Deals
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
