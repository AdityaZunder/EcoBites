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

    // Load orders from backend on mount or when user changes
    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const response = await fetch(`http://localhost:3000/api/orders/user/${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        // Ensure numeric values are numbers
                        const parsedOrders = data.map((order: any) => ({
                            ...order,
                            subtotal: parseFloat(order.subtotal),
                            serviceFee: parseFloat(order.service_fee),
                            savings: parseFloat(order.savings),
                            totalPrice: parseFloat(order.total_price)
                        }));
                        setOrders(parsedOrders);
                    }
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                }
            } else {
                setOrders([]);
            }
        };

        fetchOrders();
    }, [user]);

    // Save orders to localStorage whenever they change - REMOVED
    // We now rely on backend

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]); // Optimistic update

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
