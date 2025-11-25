import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Crown, TrendingUp, Zap, Package } from 'lucide-react';
import { useState } from 'react';
import { PremiumUpgradeModal } from '@/apps/user/components/premium/PremiumUpgradeModal';

interface DailyLimitDialogProps {
    open: boolean;
    onClose: () => void;
    currentCount: number;
    limit: number;
}

export const DailyLimitDialog = ({ open, onClose, currentCount, limit }: DailyLimitDialogProps) => {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleUpgrade = () => {
        onClose();
        setShowUpgradeModal(true);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Package className="h-5 w-5 text-orange-600" />
                            Daily Limit Reached
                        </DialogTitle>
                        <DialogDescription>
                            You've reached your daily limit of {limit} items
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg text-center">
                            <p className="text-3xl font-bold text-orange-600 mb-1">
                                {currentCount}/{limit}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Items added today
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                To continue adding more items, upgrade to Premium and unlock:
                            </p>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span>Unlimited daily orders</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Zap className="h-4 w-4 text-yellow-600" />
                                    <span>Priority queue processing</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Crown className="h-4 w-4 text-amber-600" />
                                    <span>Reduced platform fees</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <Button
                                onClick={handleUpgrade}
                                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white"
                            >
                                <Crown className="mr-2 h-4 w-4" />
                                Upgrade to Premium
                            </Button>
                            <Button variant="outline" onClick={onClose} className="w-full">
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <PremiumUpgradeModal
                open={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </>
    );
};
