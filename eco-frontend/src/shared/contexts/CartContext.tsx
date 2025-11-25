import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '@/shared/types';
import { useAuth } from './AuthContext';
import { isPremiumActive } from '@/shared/lib/premiumUtils';

/**
 * CartContext with daily item limit for non-premium users
 * TODO: Move daily item tracking to backend when integrating real API
 */

interface CartItem extends Listing {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (listing: Listing) => boolean; // Returns false if limit reached
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  canAddMoreItems: boolean;
  dailyItemsCount: number;
  dailyItemLimit: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DAILY_ITEM_LIMIT = 3; // For non-premium users

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('ecogrubs_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecogrubs_cart', JSON.stringify(items));
  }, [items]);

  // Track daily items added
  // TODO: Move this to backend when integrating real API
  const trackDailyItem = () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.lastItemAddedDate;

    if (lastDate !== today) {
      // Reset count for new day
      updateProfile({
        dailyItemsAddedToday: 1,
        lastItemAddedDate: today,
      });
    } else {
      // Increment count for today
      updateProfile({
        dailyItemsAddedToday: (user.dailyItemsAddedToday || 0) + 1,
      });
    }
  };

  const getDailyItemsCount = (): number => {
    if (!user) return 0;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.lastItemAddedDate;

    if (lastDate !== today) {
      return 0; // New day, count resets
    }

    return user.dailyItemsAddedToday || 0;
  };

  const canAddMoreItems = (): boolean => {
    if (!user) return true; // Guest users can add (will be prompted to login)
    if (isPremiumActive(user)) return true; // Premium users have no limit

    const currentCount = getDailyItemsCount();
    return currentCount < DAILY_ITEM_LIMIT;
  };

  const addItem = (listing: Listing): boolean => {
    // Check if user can add more items
    const existing = items.find((item) => item.id === listing.id);

    // If item already exists in cart, we can increase quantity without checking limit
    if (existing) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === listing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return true;
    }

    // New item - check daily limit for non-premium users
    if (!canAddMoreItems()) {
      return false; // Limit reached
    }

    // Add new item to cart
    setItems((prev) => [...prev, { ...listing, quantity: 1 }]);

    // Track this as a new daily item
    trackDailyItem();

    return true;
  };

  const removeItem = (listingId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== listingId));
  };

  const updateQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(listingId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  const dailyItemsCount = getDailyItemsCount();
  const dailyItemLimit = isPremiumActive(user) ? Infinity : DAILY_ITEM_LIMIT;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        canAddMoreItems: canAddMoreItems(),
        dailyItemsCount,
        dailyItemLimit,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
