import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { PREMIUM_PLANS, calculateAnnualSavingsPercentage, PREMIUM_BENEFITS } from '@/shared/lib/premiumUtils';
import { Crown, Check, Sparkles } from 'lucide-react';
import { MockPaymentScreen } from './MockPaymentScreen';

interface PremiumUpgradeModalProps {
    open: boolean;
    onClose: () => void;
}

export const PremiumUpgradeModal = ({ open, onClose }: PremiumUpgradeModalProps) => {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null);
    const [showPayment, setShowPayment] = useState(false);

    const handleSelectPlan = (plan: 'monthly' | 'annual') => {
        setSelectedPlan(plan);
        setShowPayment(true);
    };

    const handleBack = () => {
        setShowPayment(false);
        setSelectedPlan(null);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setSelectedPlan(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                if (showPayment) {
                    handleBack();
                } else {
                    onClose();
                }
            }
        }}>
            <DialogContent className={showPayment ? "max-w-2xl max-h-[90vh] overflow-y-auto" : "max-w-4xl max-h-[90vh] overflow-y-auto"}>
                {showPayment && selectedPlan ? (
                    <MockPaymentScreen
                        plan={selectedPlan}
                        onBack={handleBack}
                        onSuccess={handlePaymentSuccess}
                    />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl">
                                <Crown className="h-6 w-6 text-yellow-600 fill-current" />
                                Choose Your Premium Plan
                            </DialogTitle>
                        </DialogHeader>

                        {/* Plans */}
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            {/* Monthly Plan */}
                            <Card className="relative p-6 border-2 hover:border-yellow-500/50 transition-all hover:shadow-lg">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-1">Monthly</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold">${PREMIUM_PLANS.monthly.price}</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleSelectPlan('monthly')}
                                    className="w-full mb-4"
                                    variant="outline"
                                >
                                    Select Monthly Plan
                                </Button>

                                <p className="text-sm text-muted-foreground">
                                    Perfect for trying out premium benefits
                                </p>
                            </Card>

                            {/* Annual Plan - Recommended */}
                            <Card className="relative p-6 border-2 border-yellow-500 shadow-lg">
                                {/* Best Value Badge */}
                                <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    BEST VALUE
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-1">Annual</h3>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-3xl font-bold">${PREMIUM_PLANS.annual.price}</span>
                                        <span className="text-muted-foreground">/year</span>
                                    </div>
                                    <div className="inline-block px-2 py-0.5 bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold rounded">
                                        Save {calculateAnnualSavingsPercentage()}% (${PREMIUM_PLANS.annual.savings?.toFixed(2)})
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleSelectPlan('annual')}
                                    className="w-full mb-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white"
                                >
                                    Select Annual Plan
                                </Button>

                                <p className="text-sm text-muted-foreground">
                                    Best value for frequent users
                                </p>
                            </Card>
                        </div>

                        {/* Features List */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <h4 className="font-semibold mb-4 text-center">All Premium plans include:</h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {PREMIUM_BENEFITS.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Check className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-medium text-sm">{benefit.title}</span>
                                            <p className="text-xs text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">
                                Cancel anytime. No hidden fees. Immediate access to all premium features.
                            </p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
