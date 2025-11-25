import { OrderHistoryCard } from './OrderHistoryCard';
import { useOrders } from '@/shared/contexts/OrderContext';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { Package, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';

export const OrderHistorySection = () => {
    const { orders, totalSavings, totalOrders } = useOrders();
    const navigate = useNavigate();

    if (totalOrders === 0) {
        return (
            <EmptyState
                icon={Package}
                title="No orders yet"
                description="Start ordering to see your history here!"
                actionLabel="Browse Deals"
                onAction={() => navigate('/deals')}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            {totalSavings > 0 && (
                <Card className="p-6 bg-gradient-to-br from-green-500/10 to-eco/10 border-green-500/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-500">
                                ${totalSavings.toFixed(2)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Total saved across {totalOrders} order{totalOrders !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Orders List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Order History</h3>
                    <span className="text-sm text-muted-foreground">
                        {totalOrders} order{totalOrders !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="space-y-3">
                    {orders.map((order) => (
                        <OrderHistoryCard key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </div>
    );
};
