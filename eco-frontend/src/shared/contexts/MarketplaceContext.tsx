import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing, Restaurant } from '@/shared/types';
import { mockListings, mockRestaurants } from '@/shared/lib/mockData';

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

    const fetchData = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Load listings with restaurant data
            const listingsWithRestaurant = mockListings.map(listing => ({
                ...listing,
                restaurant: mockRestaurants.find(r => r.id === listing.restaurantId),
            }));

            // Sort by expiry time (soonest first), then by discount
            const sorted = [...listingsWithRestaurant].sort((a, b) => {
                const timeA = new Date(a.expiresAt).getTime();
                const timeB = new Date(b.expiresAt).getTime();
                if (timeA !== timeB) return timeA - timeB;

                const discountA = (a.originalPrice - a.discountedPrice) / a.originalPrice;
                const discountB = (b.originalPrice - b.discountedPrice) / b.originalPrice;
                return discountB - discountA;
            });

            setListings(sorted);
            setRestaurants(mockRestaurants);
            setIsLoading(false);
        }, 800);
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
