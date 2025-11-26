import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ListingCard } from '@/apps/user/components/ListingCard';
import { useMarketplace } from '@/shared/contexts/MarketplaceContext';
import { Listing } from '@/shared/types';
import { ArrowLeft, Bookmark } from 'lucide-react';

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { listings } = useMarketplace();
  const [bookmarkedListings, setBookmarkedListings] = useState<Listing[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Reload bookmarks whenever the page is accessed
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadBookmarks = () => {
      const stored = localStorage.getItem('ecogrubs_bookmarks');
      if (stored) {
        const ids = new Set<string>(JSON.parse(stored) as string[]);
        setBookmarkedIds(ids);

        const bookmarked = listings.filter(l => ids.has(l.id));
        setBookmarkedListings(bookmarked);
      } else {
        setBookmarkedIds(new Set());
        setBookmarkedListings([]);
      }
    };

    loadBookmarks();
  }, [user, navigate, location.pathname, listings]); // Re-run when pathname changes

  const toggleBookmark = (listingId: string) => {
    const newBookmarks = new Set(bookmarkedIds);
    if (newBookmarks.has(listingId)) {
      newBookmarks.delete(listingId);
    } else {
      newBookmarks.add(listingId);
    }
    setBookmarkedIds(newBookmarks);
    localStorage.setItem('ecogrubs_bookmarks', JSON.stringify([...newBookmarks]));

    setBookmarkedListings(prev => prev.filter(l => newBookmarks.has(l.id)));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/deals')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deals
        </Button>

        <h1 className="text-4xl font-bold mb-8">My Bookmarks</h1>

        {bookmarkedListings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                restaurant={listing.restaurant}
                onBookmark={() => toggleBookmark(listing.id)}
                isBookmarked={true}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Bookmarks Yet</h3>
            <p className="text-muted-foreground mb-4">
              Save your favorite deals to find them easily later
            </p>
            <Button asChild>
              <Link to="/deals">Browse Deals</Link>
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
