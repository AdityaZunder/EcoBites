import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { mockOrders, mockListings, mockRestaurants } from '@/shared/lib/mockData';
import { Order, Listing } from '@/shared/types';
import { Leaf, ArrowLeft, Package } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

type OrderWithListing = Order & {
  listing?: Listing;
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

    const restaurant = mockRestaurants.find(r => r.userId === user.id);
    if (restaurant) {
      const restaurantListingIds = mockListings
        .filter(l => l.restaurantId === restaurant.id)
        .map(l => l.id);

      const restaurantOrders = mockOrders
        .filter(o => restaurantListingIds.includes(o.listingId))
        .map(o => ({
          ...o,
          listing: mockListings.find(l => l.id === o.listingId),
        }));

      setOrders(restaurantOrders);
    }
  }, [user, navigate]);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status } : o)
    );
    toast({
      title: 'Order Updated',
      description: `Order status changed to ${status}`,
    });
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

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Item:</p>
                  <p className="font-medium">{order.listing?.title}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Quantity: </span>
                    <span className="font-medium">{order.quantity}</span>
                    <span className="text-muted-foreground ml-4">Total: </span>
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
