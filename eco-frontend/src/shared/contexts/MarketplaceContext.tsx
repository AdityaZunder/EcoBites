import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing, Restaurant } from '@/shared/types';
import { getListings, getRestaurants } from '@/shared/services/api';

interface MarketplaceContextType {
    listings: Listing[];
    restaurants: Restaurant[];
    isLoading: boolean;
    refreshListings: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [fetchedListings, fetchedRestaurants] = await Promise.all([
                getListings(),
                getRestaurants()
            ]);

            // Load listings with restaurant data
            const listingsWithRestaurant = fetchedListings.map((listing: Listing) => ({
                ...listing,
                restaurant: fetchedRestaurants.find((r: Restaurant) => r.id === listing.restaurantId),
            }));

            // Filter out expired and sold out listings
            const now = new Date();
            const activeListings = listingsWithRestaurant.filter((listing: Listing) => {
                const isNotExpired = new Date(listing.expiresAt) > now;
                const isAvailable = listing.status === 'active' && listing.remainingQuantity > 0;
                return isNotExpired && isAvailable;
            });

            // Sort by expiry time (soonest first), then by discount
            const sorted = [...activeListings].sort((a: Listing, b: Listing) => {
                const timeA = new Date(a.expiresAt).getTime();
                const timeB = new Date(b.expiresAt).getTime();
                if (timeA !== timeB) return timeA - timeB;

                const discountA = (a.originalPrice - a.discountedPrice) / a.originalPrice;
                const discountB = (b.originalPrice - b.discountedPrice) / b.originalPrice;
                return discountB - discountA;
            });

            setListings(sorted);
            setRestaurants(fetchedRestaurants);
        } catch (error) {
            console.error('Failed to fetch marketplace data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <MarketplaceContext.Provider value={{ listings, restaurants, isLoading, refreshListings: fetchData }}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => {
    const context = useContext(MarketplaceContext);
    if (context === undefined) {
        throw new Error('useMarketplace must be used within a MarketplaceProvider');
    }
    return context;
};
