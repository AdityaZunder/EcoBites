import { User } from '@/shared/types';

/**
 * Premium utility functions
 * TODO: Replace with backend API calls when integrating real backend
 */

export const PREMIUM_PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Monthly',
        price: 9.99,
        interval: 'month',
        savings: null,
    },
    annual: {
        id: 'annual',
        name: 'Annual',
        price: 99.99,
        interval: 'year',
        savings: 19.89, // $9.99 * 12 - $99.99 = $19.89 saved
    },
} as const;

export const PREMIUM_BENEFITS = [
    {
        icon: '🚀',
        title: 'Unlimited Daily Orders',
        description: 'Add as many items as you want - no 3-item limit',
    },
    {
        icon: '⚡',
        title: 'Priority Queue',
        description: 'Your orders get processed first',
    },
    {
        icon: '💰',
        title: 'Reduced Platform Fees',
        description: 'Save significantly on every order',
    },
    {
        icon: '🎯',
        title: 'Quick Priority Deals',
        description: 'Early access to the hottest deals',
    },
    {
        icon: '📦',
        title: 'Bulk Orders',
        description: 'Order large quantities for events or meal prep',
    },
    {
        icon: '⭐',
        title: 'Exclusive Offers',
        description: 'Premium-only special discounts',
    },
];

/**
 * Check if a user's premium subscription is currently active
 */
export const isPremiumActive = (user: User | null): boolean => {
    if (!user || !user.isPremium) return false;

    if (!user.premiumExpiresAt) return false;

    const expirationDate = new Date(user.premiumExpiresAt);
    const now = new Date();

    return expirationDate > now;
};

/**
 * Calculate the appropriate service fee based on premium status
 * TODO: Get fee values from backend configuration
 */
export const calculateServiceFee = (isPremium: boolean): number => {
    // TODO: Replace with backend configuration
    return isPremium ? 0.99 : 2.00;
};

/**
 * Format the premium subscription expiration date
 */
export const formatSubscriptionEndDate = (date: string): string => {
    const expirationDate = new Date(date);
    return expirationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Calculate savings from annual vs monthly plan
 */
export const calculateAnnualSavings = (): number => {
    return PREMIUM_PLANS.annual.savings || 0;
};

/**
 * Get expiration date for a premium plan
 */
export const getPremiumExpirationDate = (plan: 'monthly' | 'annual'): string => {
    const now = new Date();
    if (plan === 'monthly') {
        now.setMonth(now.getMonth() + 1);
    } else {
        now.setFullYear(now.getFullYear() + 1);
    }
    return now.toISOString();
};

/**
 * Calculate percentage saved on annual plan
 */
export const calculateAnnualSavingsPercentage = (): number => {
    const monthlyYearly = PREMIUM_PLANS.monthly.price * 12;
    const annual = PREMIUM_PLANS.annual.price;
    return Math.round(((monthlyYearly - annual) / monthlyYearly) * 100);
};
