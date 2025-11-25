import { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card } from '@/shared/components/ui/card';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Leaf, ArrowLeft } from 'lucide-react';
import { PremiumCard } from '@/apps/user/components/premium/PremiumCard';
import { OrderHistorySection } from '@/apps/user/components/orders/OrderHistorySection';
import { isPremiumActive } from '@/shared/lib/premiumUtils';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!user || user.role !== 'user') {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const userIsPremium = isPremiumActive(user);

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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/deals')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deals
        </Button>

        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="space-y-6">
          {/* Profile Info */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Account Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 555-0100"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <Button type="submit">Save Changes</Button>
            </form>
          </Card>

          {/* Premium Membership */}
          <PremiumCard isPremium={userIsPremium} />

          {/* Order History */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Order History</h2>
            <OrderHistorySection />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
