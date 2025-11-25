import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card } from '@/shared/components/ui/card';
import { PREMIUM_PLANS } from '@/shared/lib/premiumUtils';
import { useAuth } from '@/shared/contexts/AuthContext';
import { ArrowLeft, CreditCard, Lock, Check, Loader2 } from 'lucide-react';

/**
 * Mock Payment Screen for Premium Subscription
 * TODO: Replace with real payment gateway integration (Stripe, PayPal, etc.)
 */

interface MockPaymentScreenProps {
    plan: 'monthly' | 'annual';
    onBack: () => void;
    onSuccess: () => void;
}

export const MockPaymentScreen = ({ plan, onBack, onSuccess }: MockPaymentScreenProps) => {
    const { subscribeToPremium, isLoading } = useAuth();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedPlan = PREMIUM_PLANS[plan];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('MockPaymentScreen: handleSubmit called', { plan });
        setError(null);

        try {
            // TODO: Replace with real payment processing
            console.log('MockPaymentScreen: calling subscribeToPremium');
            await subscribeToPremium(plan);
            console.log('MockPaymentScreen: subscribeToPremium completed');
            setPaymentSuccess(true);

            // Auto-close after success
            setTimeout(() => {
                console.log('MockPaymentScreen: calling onSuccess');
                onSuccess();
            }, 2000);
        } catch (error) {
            console.error('MockPaymentScreen: Payment failed', error);
            setError('Payment failed. Please try again.');
        }
    };

    if (paymentSuccess) {
        return (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Check className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h2>
                <p className="text-muted-foreground mb-4">
                    Welcome to EcoBites Premium!
                </p>
                <p className="text-sm text-muted-foreground">
                    Redirecting you back...
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <Button variant="ghost" onClick={onBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Plans
                </Button>
                <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
                <p className="text-muted-foreground">
                    Subscribe to EcoBites Premium - {selectedPlan.name} Plan
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Payment Form */}
                <Card className="md:col-span-2 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Mock Notice */}
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6">
                            <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span className="font-semibold">Mock Payment -</span> This is a demo. No actual payment will be processed.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
                                <p className="text-sm text-destructive font-semibold">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Card Information */}
                        <div>
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Card Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        defaultValue="4242 4242 4242 4242"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            placeholder="MM/YY"
                                            defaultValue="12/25"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input
                                            id="cvc"
                                            placeholder="123"
                                            defaultValue="123"
                                            maxLength={3}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div>
                            <h3 className="font-semibold mb-4">Billing Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Cardholder Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        defaultValue="Demo User"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        defaultValue="user@demo.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address">Billing Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="123 Main St"
                                        defaultValue="123 Demo Street"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="New York"
                                            defaultValue="Demo City"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input
                                            id="zip"
                                            placeholder="10001"
                                            defaultValue="12345"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay $${selectedPlan.price}`
                            )}
                        </Button>
                    </form>
                </Card>

                {/* Order Summary */}
                <Card className="p-6 h-fit">
                    <h3 className="font-semibold mb-4">Order Summary</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="font-medium">{selectedPlan.name}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Billing</span>
                            <span className="font-medium">
                                {plan === 'monthly' ? 'Monthly' : 'Annually'}
                            </span>
                        </div>

                        {plan === 'annual' && selectedPlan.savings && (
                            <div className="flex justify-between text-green-600 dark:text-green-500">
                                <span>Annual Savings</span>
                                <span className="font-semibold">-${selectedPlan.savings.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="h-px bg-border my-2" />

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${selectedPlan.price}</span>
                        </div>
                    </div>

                    <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            By completing this purchase, you agree to our Terms of Service. Your subscription will auto-renew until cancelled.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
