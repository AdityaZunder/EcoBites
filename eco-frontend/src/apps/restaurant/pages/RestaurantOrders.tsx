import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

import { Order, Listing } from '@/shared/types';
import { Leaf, ArrowLeft, Package } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { getRestaurantByUserId, getOrdersByRestaurant, updateOrderStatus as apiUpdateOrderStatus } from '@/shared/services/api';

type OrderWithListing = Order & {
  listing?: Listing;
  userName?: string;
  userEmail?: string;
};

const RestaurantOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithListing[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'restaurant') {
      navigate('/login?role=restaurant');
      return;
    }

    const fetchOrders = async () => {
      try {
        // In a real app, the restaurant ID would be associated with the user
        // Fetch all restaurants to find the one owned by this user
        const restaurant = await getRestaurantByUserId(user.id);

        if (restaurant) {
          const data = await getOrdersByRestaurant(restaurant.id);
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch restaurant orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive',
        });
      }
    };

    fetchOrders();
  }, [user, navigate, toast]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await apiUpdateOrderStatus(orderId, status);
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );
      toast({
        title: 'Order Updated',
        description: `Order status changed to ${status}`,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full gradient-eco flex items-center justify-center">
              <Leaf className="h-6 w-6 text-eco-foreground" />
            </div>
            <h1 className="text-2xl font-bold">EcoBites</h1>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/restaurant/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl font-bold mb-8">Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    {order.userName && (
                      <p className="text-sm font-medium text-primary mt-1">
                        Customer: {order.userName}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      order.status === 'completed' ? 'default' :
                        order.status === 'confirmed' ? 'secondary' :
                          'outline'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>

                <div className="mb-4 space-y-2">
                  <p className="text-sm text-muted-foreground mb-1">Items:</p>
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="font-medium">{item.title}</span>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Qty: </span>
                        <span className="font-medium">{item.quantity}</span>
                        <span className="text-muted-foreground ml-2">Price: </span>
                        <span className="font-medium">${item.priceAtPurchase.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Order Value: </span>
                    <span className="font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground">
              Orders will appear here when customers purchase your listings
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default RestaurantOrders;
