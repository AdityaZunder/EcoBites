import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card } from '@/shared/components/ui/card';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { mockRestaurants } from '@/shared/lib/mockData';
import { Restaurant } from '@/shared/types';
import { Leaf, ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

const RestaurantProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'restaurant') {
      navigate('/login?role=restaurant');
      return;
    }

    const rest = mockRestaurants.find(r => r.userId === user.id);
    if (rest) {
      setRestaurant(rest);
      setFormData({
        name: rest.name,
        description: rest.description,
        address: rest.address,
        phone: rest.phone,
      });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: 'Profile Updated',
      description: 'Your restaurant information has been saved',
    });
  };

  if (!user || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/restaurant/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl font-bold mb-8">Restaurant Profile</h1>

        <div className="space-y-6">
          {/* Logo Upload */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Restaurant Logo</h2>
            <div className="flex items-center gap-6">
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <Leaf className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1">
                <Button variant="outline" className="mb-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-sm text-muted-foreground">
                  Recommended: Square image, at least 200x200px (Mock upload)
                </p>
              </div>
            </div>
          </Card>

          {/* Restaurant Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Restaurant Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Tell customers about your restaurant..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, City"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 555-0100"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Restaurant Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold">{restaurant.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rating</p>
                <p className="text-2xl font-bold">{restaurant.rating} ⭐</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                <p className="text-sm font-medium">
                  {new Date(restaurant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RestaurantProfile;
