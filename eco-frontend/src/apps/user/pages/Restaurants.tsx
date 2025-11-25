import { useState, useEffect } from 'react';
import { mockRestaurants } from '@/shared/lib/mockData';
import { Restaurant } from '@/shared/types';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { RestaurantCard } from '@/apps/user/components/RestaurantCard';
import { SkeletonLoader } from '@/shared/components/common/SkeletonLoader';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { Search, Store } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setRestaurants(mockRestaurants);
            setLoading(false);
        }, 800);
    }, []);

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <PageHeader
                title="Local Restaurants"
                description="Discover partners fighting food waste in your area"
            >
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background/50 backdrop-blur-sm"
                    />
                </div>
            </PageHeader>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonLoader key={i} type="card" count={1} />
                    ))}
                </div>
            ) : filteredRestaurants.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRestaurants.map((restaurant, index) => (
                        <div
                            key={restaurant.id}
                            className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <RestaurantCard restaurant={restaurant} />
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Store}
                    title="No restaurants found"
                    description={searchQuery ? `No restaurants match "${searchQuery}"` : "No restaurants available right now."}
                    actionLabel="Clear Search"
                    onAction={() => setSearchQuery('')}
                />
            )}
        </div>
    );
};

export default Restaurants;
