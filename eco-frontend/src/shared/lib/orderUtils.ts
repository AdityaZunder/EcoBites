import { Order, OrderItem } from '@/shared/types';
import { Listing } from '@/shared/types';

/**
 * Order utility functions
 * TODO: Replace with backend API calls when integrating real backend
 */

interface CartItem extends Listing {
    quantity: number;
}

/**
 * Create an order object from cart items
 */
export const createOrder = (
    cartItems: CartItem[],
    userId: string,
    serviceFee: number
): Order => {
    const items: OrderItem[] = cartItems.map(item => ({
        listing: item,
        quantity: item.quantity,
        priceAtPurchase: item.discountedPrice,
    }));

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
    );

    const savings = cartItems.reduce(
        (sum, item) => sum + (item.originalPrice - item.discountedPrice) * item.quantity,
        0
    );

    const totalPrice = subtotal + serviceFee;

    const restaurantIds = Array.from(
        new Set(cartItems.map(item => item.restaurantId))
    );

    return {
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        items,
        subtotal,
        serviceFee,
        savings,
        totalPrice,
        status: 'confirmed',
        restaurantIds,
        createdAt: new Date().toISOString(),
    };
};

/**
 * Calculate order total with appropriate fees
 */
export const calculateOrderTotal = (
    items: CartItem[],
    serviceFee: number
): { subtotal: number; total: number; savings: number } => {
    const subtotal = items.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
    );

    const savings = items.reduce(
        (sum, item) => sum + (item.originalPrice - item.discountedPrice) * item.quantity,
        0
    );

    const total = subtotal + serviceFee;

    return { subtotal, total, savings };
};

/**
 * Format order date for display
 */
export const formatOrderDate = (date: string): string => {
    const orderDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }
};

/**
 * Get color for order status badge
 */
export const getOrderStatusColor = (status: Order['status']): string => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
        case 'confirmed':
            return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
        case 'completed':
            return 'bg-green-500/10 text-green-700 dark:text-green-400';
        case 'cancelled':
            return 'bg-red-500/10 text-red-700 dark:text-red-400';
        default:
            return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
};

/**
 * Get display label for order status
 */
export const getOrderStatusLabel = (status: Order['status']): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};
