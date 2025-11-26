import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCart } from '@/shared/contexts/CartContext';
import { useOrders } from '@/shared/contexts/OrderContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/hooks/use-toast';
import { CreditCard, MapPin, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { createOrder } from '@/shared/lib/orderUtils';
import { calculateServiceFee, isPremiumActive } from '@/shared/lib/premiumUtils';
import { Badge } from '@/shared/components/ui/badge';
import { PlaceholderMap } from '@/shared/components/common/PlaceholderMap';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userIsPremium = isPremiumActive(user);
  const serviceFee = calculateServiceFee(userIsPremium);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    pickupTime: '',
    specialInstructions: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Not Logged In',
        description: 'Please log in to complete your order',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Check daily order limit for non-premium users
    if (!userIsPremium) {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = user.lastOrderDate;
      const dailyOrderCount = lastDate === today ? (user.dailyOrdersPlacedToday || 0) : 0;

      if (dailyOrderCount >= 3) {
        toast({
          title: 'Daily Order Limit Reached',
          description: 'Free users can place up to 3 orders per day. Upgrade to Premium for unlimited orders!',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    // TODO: Replace with real payment gateway integration
    setTimeout(() => {
      // Create order using utility function
      const order = createOrder(items, user.id, serviceFee);
      order.pickupTime = formData.pickupTime;

      // Add order to history
      addOrder(order);

      clearCart();
      setIsProcessing(false);

      toast({
        title: 'Order Placed Successfully! 🎉',
        description: 'Your order has been confirmed and is being prepared.',
      });

      navigate(`/order-confirmation/${order.id}`);
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate('/cart')}
        className="mb-6 hover:bg-muted/50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <PageHeader
        title="Checkout"
        description="Complete your order securely"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="p-6 space-y-6 shadow-sm border-border/50">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Delivery Address</h2>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className="h-11"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="h-11"
                  />
                </div>

                {/* Map Preview */}
                <div className="h-40 rounded-xl overflow-hidden border border-border/50">
                  <PlaceholderMap label="Delivery Location" />
                </div>
              </div>
            </Card>

            {/* Pickup Time */}
            <Card className="p-6 space-y-6 shadow-sm border-border/50">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Pickup Details</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pickupTime">Preferred Pickup Time</Label>
                  <Input
                    id="pickupTime"
                    name="pickupTime"
                    type="datetime-local"
                    required
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special requests or dietary restrictions..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6 space-y-6 shadow-sm border-border/50">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Payment Information</h2>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="h-11 pl-11"
                    />
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="h-11"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      required
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Your payment information is secure and encrypted.</span>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6 lg:sticky lg:top-24 shadow-premium border-border/50">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-semibold text-sm">
                      ${(item.discountedPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Service Fee</span>
                    {userIsPremium && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-500 text-[10px] px-1.5 py-0">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${(totalPrice + serviceFee).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all"
                size="lg"
                disabled={isProcessing}
                onClick={handleSubmit}
              >
                {isProcessing ? 'Processing...' : `Pay $${(totalPrice + serviceFee).toFixed(2)}`}
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
