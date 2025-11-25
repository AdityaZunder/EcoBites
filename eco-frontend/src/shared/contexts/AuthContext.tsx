import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/shared/types';
import { useToast } from '@/shared/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  subscribeToPremium: (plan: 'monthly' | 'annual') => Promise<void>;
  cancelPremium: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
// TODO: Replace with real backend authentication
const MOCK_USERS = {
  'user@demo.com': {
    id: 'user-1',
    email: 'user@demo.com',
    role: 'user' as UserRole,
    name: 'Demo User',
    phone: '+1 555-0100',
    isPriority: false,
    isPremium: false,
    premiumPlan: null,
    dailyOrdersPlacedToday: 0,
    lastOrderDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  'restaurant@demo.com': {
    id: 'user-rest-1',
    email: 'restaurant@demo.com',
    role: 'restaurant' as UserRole,
    name: 'Green Leaf Bistro',
    phone: '+1 555-0101',
    createdAt: new Date().toISOString(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('ecogrubs_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('ecogrubs_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock authentication
    const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];

    if (!mockUser || mockUser.role !== role) {
      setIsLoading(false);
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials or wrong account type',
        variant: 'destructive',
      });
      throw new Error('Invalid credentials');
    }

    setUser(mockUser);
    localStorage.setItem('ecogrubs_user', JSON.stringify(mockUser));
    setIsLoading(false);

    toast({
      title: 'Welcome back!',
      description: `Logged in as ${mockUser.name}`,
    });
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role,
      name,
      isPriority: false,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('ecogrubs_user', JSON.stringify(newUser));
    setIsLoading(false);

    toast({
      title: 'Account Created!',
      description: `Welcome to EcoBites, ${name}`,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecogrubs_user');
    toast({
      title: 'Logged out',
      description: 'See you soon!',
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('ecogrubs_user', JSON.stringify(updatedUser));

    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved',
    });
  };

  const subscribeToPremium = async (plan: 'monthly' | 'annual') => {
    console.log('AuthContext: subscribeToPremium called', { plan, user });
    if (!user) {
      console.warn('AuthContext: subscribeToPremium called but no user');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Replace with real backend API call for payment processing
      const expirationDate = new Date();
      if (plan === 'monthly') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      const updatedUser = {
        ...user,
        isPremium: true,
        premiumPlan: plan,
        premiumExpiresAt: expirationDate.toISOString(),
      };

      setUser(updatedUser);
      localStorage.setItem('ecogrubs_user', JSON.stringify(updatedUser));

      toast({
        title: '🎉 Welcome to Premium!',
        description: `Your ${plan} subscription is now active`,
      });
    } catch (error) {
      console.error('AuthContext: subscribeToPremium failed', error);
      toast({
        title: 'Subscription Failed',
        description: 'There was an error processing your subscription. Please try again.',
        variant: 'destructive',
      });
      throw error; // Re-throw to let caller know
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPremium = () => {
    if (!user) return;

    // TODO: Replace with real backend API call
    const updatedUser = {
      ...user,
      isPremium: false,
      premiumPlan: null,
      premiumExpiresAt: undefined,
    };

    setUser(updatedUser);
    localStorage.setItem('ecogrubs_user', JSON.stringify(updatedUser));

    toast({
      title: 'Subscription Cancelled',
      description: 'Your premium subscription has been cancelled',
      variant: 'destructive',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, subscribeToPremium, cancelPremium, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
