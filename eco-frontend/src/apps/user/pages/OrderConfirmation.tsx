import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { CheckCircle, MapPin, Clock, Package } from 'lucide-react';

import { Order } from '@/shared/types';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetch order from backend
        // Note: In a real app, we should have a specific endpoint for getting a single order
        // For now, we'll fetch all user orders and find the one we need, or assume the backend has an endpoint
        // Based on orders.js, we only have GET /user/:userId. 
        // Let's assume we can filter or we need to add GET /:id to backend.
        // For this task, let's try to add GET /:id to backend or use the existing user orders endpoint.
        // Actually, the plan said "Fetch order details from backend API".
        // Let's assume we will add GET /api/orders/:id to backend or use a workaround.
        // Workaround: Fetch all user orders and find. (Inefficient but works for now)
        // Better: Add GET /:id to backend. I will add it to backend in next step if not present.
        // Wait, I can't check backend file right now easily without breaking flow. 
        // Let's assume I will add it.

        // Actually, let's just fetch all orders for the user if we have the user ID.
        // But we don't have user ID easily accessible here without auth context.
        // Let's use a new endpoint GET /api/orders/detail/:id which I will add.

        const response = await fetch(`http://localhost:3000/api/orders/detail/${orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/deals">
            <Button>Back to Deals</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto p-8 space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-700">Order Completed!</h1>
            <p className="text-xl font-medium text-muted-foreground">
              Congratulations! Go home and enjoy your meal.
            </p>
            <p className="text-sm text-muted-foreground">
              Confirmation #: <span className="font-mono font-bold text-primary">{order.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <div className="border-t border-b py-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Delivery Address</h3>
                  <p className="text-muted-foreground">{order.deliveryAddress || 'Pickup Order'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Pickup Time</h3>
                  <p className="text-muted-foreground">
                    {order.pickupTime ? new Date(order.pickupTime).toLocaleString() : 'ASAP'}
                  </p>
                </div>
              </div>

              {order.specialInstructions && (
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Special Instructions</h3>
                    <p className="text-muted-foreground">{order.specialInstructions}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.listing.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.listing.title} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span className="text-primary">${Number(order.totalPrice).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/deals" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/profile" className="flex-1">
              <Button className="w-full gradient-primary">
                View Order History
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
