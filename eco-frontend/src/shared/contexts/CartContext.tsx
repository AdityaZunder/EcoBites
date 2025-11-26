import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '@/shared/types';
import { useAuth } from './AuthContext';
import { isPremiumActive } from '@/shared/lib/premiumUtils';

/**
 * CartContext provides cart management functionality.
 * It handles adding/removing items, updating quantities, and enforcing daily limits for non-premium users.
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

const DAILY_ITEM_LIMIT = 3;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('ecogrubs_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecogrubs_cart', JSON.stringify(items));
  }, [items]);

  const getDailyOrdersCount = (): number => {
    if (!user) return 0;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.lastOrderDate;

    if (lastDate !== today) {
      return 0;
    }

    return user.dailyOrdersPlacedToday || 0;
  };

  const canAddMoreItems = (): boolean => {
    if (!user) return true;
    if (isPremiumActive(user)) return true;

    const currentCount = getDailyOrdersCount();
    return currentCount < DAILY_ITEM_LIMIT;
  };

  const addItem = (listing: Listing): boolean => {
    const existing = items.find((item) => item.id === listing.id);

    if (existing) {
      if (existing.quantity >= listing.remainingQuantity) {
        return false;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === listing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return true;
    }

    if (listing.remainingQuantity < 1) {
      return false;
    }
    setItems((prev) => [...prev, { ...listing, quantity: 1 }]);

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

    const item = items.find(i => i.id === listingId);
    if (item && quantity > item.remainingQuantity) {
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

  const dailyItemsCount = getDailyOrdersCount();
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
