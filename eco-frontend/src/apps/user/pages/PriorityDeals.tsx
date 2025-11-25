import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ListingCard } from '@/apps/user/components/ListingCard';
import { mockListings } from '@/shared/lib/mockData';
import { Listing } from '@/shared/types';
import { isPremiumActive } from '@/shared/lib/premiumUtils';
import { Crown, ArrowLeft } from 'lucide-react';
import { PremiumUpgradeModal } from '@/apps/user/components/premium/PremiumUpgradeModal';

const PriorityDeals = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [priorityListings, setPriorityListings] = useState<Listing[]>([]);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    useEffect(() => {
        // If user is not logged in, redirect to login
        if (!user) {
            navigate('/login');
            return;
        }

        // If user is not premium, show modal or redirect
        if (!isPremiumActive(user)) {
            setShowPremiumModal(true);
            // Optional: redirect back to deals if they close the modal without upgrading
            // But for now, we'll just show the modal and let them decide
        }

        // Filter for priority listings
        const priority = mockListings.filter(
            l => l.isPriorityAccess && l.status === 'active' && new Date(l.expiresAt) > new Date()
        );
        setPriorityListings(priority);
    }, [user, navigate]);

    const handleModalClose = () => {
        setShowPremiumModal(false);
        if (!isPremiumActive(user)) {
            navigate('/deals');
        }
    };

    if (!user) return null;

    if (!isPremiumActive(user)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <PremiumUpgradeModal open={showPremiumModal} onClose={handleModalClose} />
                <div className="text-center">
                    <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Premium Feature</h1>
                    <p className="text-muted-foreground mb-4">Priority Deals are exclusive to premium members.</p>
                    <Button onClick={() => setShowPremiumModal(true)}>Upgrade to Access</Button>
                    <Button variant="ghost" className="ml-2" onClick={() => navigate('/deals')}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/deals')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Crown className="h-8 w-8 text-yellow-500 fill-current" />
                            Priority Deals
                        </h1>
                        <p className="text-muted-foreground">Exclusive early access to the best deals</p>
                    </div>
                </div>

                {priorityListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {priorityListings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h2 className="text-xl font-semibold mb-2">No Priority Deals Available</h2>
                        <p className="text-muted-foreground">Check back later for exclusive offers!</p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate('/deals')}>
                            Browse All Deals
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PriorityDeals;
