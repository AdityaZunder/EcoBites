import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { CheckCircle, MapPin, Clock, Package } from 'lucide-react';

interface Order {
  id: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    discountedPrice: number;
  }>;
  total: number;
  deliveryAddress: string;
  pickupTime: string;
  specialInstructions: string;
  date: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('ecogrubs_orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId);
    setOrder(foundOrder || null);
  }, [orderId]);

  if (!order) {
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
              <div className="h-20 w-20 rounded-full bg-eco/10 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-eco" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. Your confirmation number is:
            </p>
            <div className="text-2xl font-mono font-bold text-primary">
              #{order.id.toUpperCase()}
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <div className="border-t border-b py-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Delivery Address</h3>
                  <p className="text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Pickup Time</h3>
                  <p className="text-muted-foreground">
                    {new Date(order.pickupTime).toLocaleString()}
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
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.title} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.discountedPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
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
