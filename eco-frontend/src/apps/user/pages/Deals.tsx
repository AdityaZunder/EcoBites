import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/components/ui/input';
import { ListingCard } from '@/apps/user/components/ListingCard';
import { useMarketplace } from '@/shared/contexts/MarketplaceContext';
import { Search } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/PageHeader';
import { SkeletonLoader } from '@/shared/components/common/SkeletonLoader';
import { EmptyState } from '@/shared/components/common/EmptyState';

const Deals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { listings, isLoading } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Load bookmarks from localStorage
    const stored = localStorage.getItem('ecogrubs_bookmarks');
    if (stored) {
      setBookmarkedIds(new Set(JSON.parse(stored)));
    }
  }, []);

  const filteredListings = listings.filter(listing => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.restaurant?.name.toLowerCase().includes(query) ||
      listing.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const toggleBookmark = (listingId: string) => {
    const newBookmarks = new Set(bookmarkedIds);
    if (newBookmarks.has(listingId)) {
      newBookmarks.delete(listingId);
    } else {
      newBookmarks.add(listingId);
    }
    setBookmarkedIds(newBookmarks);
    localStorage.setItem('ecogrubs_bookmarks', JSON.stringify([...newBookmarks]));
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <PageHeader
        title="🔥 Hot Deals"
        description="Save money and reduce waste with amazing deals from local restaurants"
      >
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 backdrop-blur-sm"
          />
        </div>
      </PageHeader>

      {isLoading ? (
        <SkeletonLoader count={8} />
      ) : filteredListings.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings.map((listing, index) => (
            <div
              key={listing.id}
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ListingCard
                listing={listing}
                restaurant={listing.restaurant}
                onBookmark={() => toggleBookmark(listing.id)}
                isBookmarked={bookmarkedIds.has(listing.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No deals found"
          description={searchQuery ? `No deals match "${searchQuery}"` : "No deals available right now. Check back later!"}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      )}
    </div>
  );
};

export default Deals;
