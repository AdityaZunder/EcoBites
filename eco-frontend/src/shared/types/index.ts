export type UserRole = 'user' | 'restaurant';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  isPriority?: boolean;
  // Premium subscription fields
  // TODO: Move to backend when integrating real API
  isPremium?: boolean;
  premiumPlan?: 'monthly' | 'annual' | null;
  premiumExpiresAt?: string;
  // Daily order limit tracking (TODO: Move to backend)
  dailyOrdersPlacedToday?: number;
  lastOrderDate?: string;
  // Daily priority listing limit tracking for restaurants (TODO: Move to backend)
  dailyPriorityItemsAddedToday?: number;
  lastPriorityItemDate?: string;
  createdAt: string;
}

export interface PremiumSubscription {
  plan: 'monthly' | 'annual';
  price: number;
  startDate: string;
  expiresAt: string;
  autoRenew: boolean;
}

export interface Restaurant {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  logo?: string;
  rating: number;
  totalOrders: number;
  category: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  restaurantId: string;
  restaurant?: Restaurant;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  remainingQuantity: number;
  expiresAt: string;
  imageUrl?: string;
  tags: string[];
  isPriorityAccess: boolean;
  createdAt: string;
  status: 'active' | 'expired' | 'sold_out';
}

export interface OrderItem {
  listing: Listing;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  savings: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  pickupTime?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
  restaurantIds: string[];
  createdAt: string;
  // Legacy/Mock fields
  listingId?: string;
  quantity?: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'new_listing' | 'expiring_soon' | 'order_update' | 'general';
  isRead: boolean;
  createdAt: string;
}
