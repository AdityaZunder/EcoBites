import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useCart } from '@/shared/contexts/CartContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { calculateServiceFee, isPremiumActive } from '@/shared/lib/premiumUtils';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userIsPremium = isPremiumActive(user);
  const serviceFee = calculateServiceFee(userIsPremium);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added any delicious deals yet."
          actionLabel="Browse Deals"
          onAction={() => navigate('/deals')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <PageHeader
        title={`Shopping Cart (${totalItems} items)`}
        description="Review your eco-friendly picks before checkout"
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow duration-300 border-border/50">
              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-sm"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg leading-tight truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground truncate mt-1">{item.restaurant?.name || 'Restaurant'}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="destructive" className="text-xs font-bold">
                        {Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 mt-4">
                    <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-md hover:bg-background shadow-sm"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-4 text-center font-semibold text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-md hover:bg-background shadow-sm"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-muted-foreground line-through">
                        ${(item.originalPrice * item.quantity).toFixed(2)}
                      </div>
                      <div className="font-bold text-xl text-primary">
                        ${(item.discountedPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-6 lg:sticky lg:top-24 shadow-premium border-border/50">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-3 text-sm">
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
              <div className="flex justify-between text-eco-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-eco inline-block" />
                  Savings
                </span>
                <span className="font-bold">-${(items.reduce((acc, item) => acc + (item.originalPrice - item.discountedPrice) * item.quantity, 0)).toFixed(2)}</span>
              </div>

              <div className="h-px bg-border my-2" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(totalPrice + serviceFee).toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all"
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="outline" className="w-full" onClick={() => navigate('/deals')}>
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
