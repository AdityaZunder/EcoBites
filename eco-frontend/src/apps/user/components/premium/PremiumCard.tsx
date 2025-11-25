import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { PREMIUM_BENEFITS } from '@/shared/lib/premiumUtils';
import { Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PremiumUpgradeModal } from './PremiumUpgradeModal';

interface PremiumCardProps {
    isPremium: boolean;
}

export const PremiumCard = ({ isPremium }: PremiumCardProps) => {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    console.log('PremiumCard: render', { isPremium, showUpgradeModal });

    return (
        <>
            <Card className="relative overflow-hidden">
                {/* Premium Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10" />

                <div className="relative p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-500 fill-current" />
                                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    Premium Membership
                                </h2>
                            </div>
                            <p className="text-muted-foreground">
                                {isPremium
                                    ? 'You\'re enjoying all premium benefits'
                                    : 'Unlock unlimited savings and exclusive perks'}
                            </p>
                        </div>

                        {isPremium && (
                            <div className="flex-shrink-0">
                                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-sm font-semibold shadow-sm">
                                    <Sparkles className="h-3 w-3 fill-current" />
                                    Active
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {PREMIUM_BENEFITS.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-yellow-500/30 transition-colors"
                            >
                                <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-sm mb-0.5">{benefit.title}</h3>
                                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    {!isPremium && (
                        <Button
                            onClick={() => setShowUpgradeModal(true)}
                            size="lg"
                            className="w-full bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 hover:from-yellow-600 hover:via-amber-700 hover:to-orange-700 text-white shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5"
                        >
                            <Crown className="mr-2 h-5 w-5 fill-current" />
                            Upgrade to Premium
                        </Button>
                    )}

                    {isPremium && (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Thank you for being a premium member! 🎉
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            <PremiumUpgradeModal
                open={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </>
    );
};
