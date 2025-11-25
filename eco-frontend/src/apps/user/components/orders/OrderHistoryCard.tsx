import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Order } from '@/shared/types';
import { formatOrderDate, getOrderStatusColor, getOrderStatusLabel } from '@/shared/lib/orderUtils';
import { ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

interface OrderHistoryCardProps {
    order: Order;
}

export const OrderHistoryCard = ({ order }: OrderHistoryCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const firstRestaurantName = order.items[0]?.listing?.restaurant?.name || 'Restaurant';

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{firstRestaurantName}</h3>
                            {order.restaurantIds.length > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{order.restaurantIds.length - 1} more
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatOrderDate(order.createdAt)}
                            </span>
                            <span className="text-xs">Order #{order.id.slice(-8)}</span>
                        </div>
                    </div>

                    <Badge className={getOrderStatusColor(order.status)}>
                        {getOrderStatusLabel(order.status)}
                    </Badge>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-lg">${order.totalPrice.toFixed(2)}</div>
                        {order.savings > 0 && (
                            <div className="text-xs text-green-600 dark:text-green-500">
                                Saved ${order.savings.toFixed(2)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full justify-center"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="mr-1 h-4 w-4" />
                            Hide Details
                        </>
                    ) : (
                        <>
                            <ChevronDown className="mr-1 h-4 w-4" />
                            View Details
                        </>
                    )}
                </Button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-border p-4 sm:p-5 bg-muted/30 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Items */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Order Items</h4>
                        <div className="space-y-2">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <img
                                        src={item.listing.imageUrl}
                                        alt={item.listing.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-sm truncate">{item.listing.title}</h5>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {item.listing.restaurant?.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                            <span className="text-xs font-semibold">
                                                ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total Breakdown */}
                    <div className="pt-3 border-t border-border space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Service Fee</span>
                            <span className="font-medium">${order.serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600 dark:text-green-500">
                            <span>Savings</span>
                            <span className="font-semibold">-${order.savings.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-border my-2" />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Paid</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Pickup Info */}
                    {order.pickupTime && (
                        <div className="pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Pickup Time:</span>
                                <span className="font-medium">
                                    {new Date(order.pickupTime).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};
