import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Countdown } from '@/shared/components/Countdown';
import { mockListings, mockRestaurants } from '@/shared/lib/mockData';
import { Listing, Restaurant, Order } from '@/shared/types';
import { getListings, getRestaurantByUserId, getOrdersByRestaurant } from '@/shared/services/api';
import {
  Leaf,
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Edit,
  Trash2,
  User,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToast } from '@/shared/hooks/use-toast';

/**
 * RestaurantDashboard component.
 * Displays the main dashboard for restaurant owners, including stats, listings, and actions.
 */
const RestaurantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login?role=restaurant');
      return;
    }

    if (user.role !== 'restaurant') {
      navigate('/deals');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const rest = await getRestaurantByUserId(user.id);
        setRestaurant(rest || null);

        if (rest) {
          const fetchedListings = await getListings(rest.id);
          setListings(fetchedListings);

          try {
            const fetchedOrders = await getOrdersByRestaurant(rest.id);
            setOrders(fetchedOrders);
          } catch (err) {
            console.error('Failed to fetch orders:', err);
            setOrders([]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteListing = (listingId: string) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
    toast({
      title: 'Listing Deleted',
      description: 'Your listing has been removed',
    });
  };

  if (!user || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const activeListings = listings.filter(l => l.status === 'active' && new Date(l.expiresAt) > new Date());
  const totalRevenue = Number(restaurant.earnings ?? orders.reduce((sum, order) => sum + order.totalPrice, 0));
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full gradient-eco flex items-center justify-center">
                <Leaf className="h-6 w-6 text-eco-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EcoBites</h1>
                <p className="text-xs text-muted-foreground">Restaurant Portal</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {restaurant.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/restaurant/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Restaurant Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome back, {restaurant.name}! 👋</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your listings and track your impact</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <StatCard
            icon={<Package className="h-6 w-6 text-primary" />}
            title="Active Listings"
            value={activeListings.length}
            subtitle="Currently available"
          />
          <StatCard
            icon={<ShoppingBag className="h-6 w-6 text-eco" />}
            title="Today's Orders"
            value={todayOrders.length}
            subtitle="Orders received today"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6 text-eco" />}
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            subtitle="All time earnings"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            title="Rating"
            value={restaurant.rating}
            subtitle={`${restaurant.totalOrders} total orders`}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button asChild className="gradient-primary w-full sm:w-auto">
            <Link to="/restaurant/create-listing">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create New Listing</span>
              <span className="sm:hidden">New Listing</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/restaurant/orders">
              <span className="hidden sm:inline">View All Orders</span>
              <span className="sm:hidden">Orders</span>
            </Link>
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Your Listings</h2>

          {listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map(listing => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  onEdit={() => navigate(`/restaurant/edit-listing/${listing.id}`)}
                  onDelete={() => handleDeleteListing(listing.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No listings yet</p>
              <p className="mb-4">Create your first listing to start reducing food waste!</p>
              <Button asChild>
                <Link to="/restaurant/create-listing">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Listing
                </Link>
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle }: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
}) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </Card>
);

const ListingRow = ({
  listing,
  onEdit,
  onDelete
}: {
  listing: Listing;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const isExpired = new Date(listing.expiresAt) < new Date();
  const isLowStock = listing.remainingQuantity < 5;

  return (
    <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-muted shrink-0">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base sm:text-lg truncate">{listing.title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground truncate mb-2">{listing.description}</p>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ${listing.discountedPrice.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${listing.originalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isExpired ? (
              <Badge variant="destructive">Expired</Badge>
            ) : listing.remainingQuantity === 0 ? (
              <Badge variant="destructive">Sold Out</Badge>
            ) : (
              <>
                <Badge variant={isLowStock ? "destructive" : "outline"}>
                  {listing.remainingQuantity} left
                </Badge>
                <Countdown expiresAt={listing.expiresAt} size="sm" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-2 shrink-0">
        <Button variant="outline" size="icon" onClick={onDelete} className="h-9 w-9 sm:h-10 sm:w-10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
