import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/shared/types';
import { useAuth } from './AuthContext';

/**
 * Order Context - Manages order history
 * TODO: Replace localStorage with real backend API calls
 */

interface OrderContextType {
    orders: Order[];
    addOrder: (order: Order) => void;
    getOrderHistory: () => Order[];
    getOrderById: (id: string) => Order | undefined;
    totalSavings: number;
    totalOrders: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, updateProfile } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    // Load orders from localStorage on mount or when user changes
    useEffect(() => {
        if (user) {
            // TODO: Replace with API call to backend
            const storedOrders = localStorage.getItem(`ecogrubs_orders_${user.id}`);
            if (storedOrders) {
                try {
                    setOrders(JSON.parse(storedOrders));
                } catch (error) {
                    console.error('Failed to parse stored orders:', error);
                    setOrders([]);
                }
            } else {
                setOrders([]);
            }
        } else {
            setOrders([]);
        }
    }, [user]);

    // Save orders to localStorage whenever they change
    useEffect(() => {
        if (user && orders.length > 0) {
            // TODO: Replace with API call to backend
            localStorage.setItem(`ecogrubs_orders_${user.id}`, JSON.stringify(orders));
        }
    }, [orders, user]);

    const addOrder = (order: Order) => {
        // TODO: Replace with API call to backend
        setOrders(prev => [order, ...prev]); // Add to beginning for chronological order

        // Track daily order count for free users
        if (user) {
            const today = new Date().toISOString().split('T')[0];
            const lastDate = user.lastOrderDate;

            if (lastDate !== today) {
                // Reset count for new day
                updateProfile({
                    dailyOrdersPlacedToday: 1,
                    lastOrderDate: today,
                });
            } else {
                // Increment count for today
                updateProfile({
                    dailyOrdersPlacedToday: (user.dailyOrdersPlacedToday || 0) + 1,
                });
            }
        }
    };

    const getOrderHistory = () => {
        return orders;
    };

    const getOrderById = (id: string) => {
        return orders.find(order => order.id === id);
    };

    const totalSavings = orders.reduce((sum, order) => sum + order.savings, 0);
    const totalOrders = orders.length;

    return (
        <OrderContext.Provider
            value={{
                orders,
                addOrder,
                getOrderHistory,
                getOrderById,
                totalSavings,
                totalOrders,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};
