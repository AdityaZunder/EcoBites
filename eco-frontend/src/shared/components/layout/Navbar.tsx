import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useAuth } from "@/shared/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, ShoppingCart, User, Crown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Badge } from "@/shared/components/ui/badge";
import { useCart } from "@/shared/contexts/CartContext";
import { isPremiumActive } from "@/shared/lib/premiumUtils";
import { PremiumBadge } from "@/apps/user/components/premium/PremiumBadge";
import { usePremiumModal } from "@/shared/contexts/PremiumModalContext";

export function Navbar() {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const location = useLocation();
    const { openModal } = usePremiumModal();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const isActive = (path: string) => location.pathname === path;

    const handlePriorityClick = (e: React.MouseEvent) => {
        if (!isPremiumActive(user)) {
            e.preventDefault();
            openModal();
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-eco to-eco-light shadow-sm">
                                <Leaf className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">EcoBites</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                            {user?.role === 'user' && (
                                <>
                                    <Link
                                        to="/deals"
                                        className={`transition-colors hover:text-primary ${isActive('/deals') ? 'text-primary' : 'text-muted-foreground'}`}
                                    >
                                        Browse Deals
                                    </Link>
                                    <Link
                                        to="/priority-deals"
                                        onClick={handlePriorityClick}
                                        className={`transition-colors hover:text-primary flex items-center gap-1 ${isActive('/priority-deals') ? 'text-primary' : 'text-muted-foreground'}`}
                                    >
                                        <Crown className="h-3 w-3 text-yellow-500" />
                                        Priority Deals
                                    </Link>
                                    <Link
                                        to="/restaurants"
                                        className={`transition-colors hover:text-primary ${isActive('/restaurants') ? 'text-primary' : 'text-muted-foreground'}`}
                                    >
                                        Restaurants
                                    </Link>
                                </>
                            )}
                            {user?.role === 'restaurant' && (
                                <>
                                    <Link
                                        to="/restaurant/dashboard"
                                        className={`transition-colors hover:text-primary ${isActive('/restaurant/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/restaurant/orders"
                                        className={`transition-colors hover:text-primary ${isActive('/restaurant/orders') ? 'text-primary' : 'text-muted-foreground'}`}
                                    >
                                        Orders
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {user?.role === 'user' && (
                            <Link to="/cart">
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>
                        )}

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full relative">
                                        <User className="h-5 w-5" />
                                        {isPremiumActive(user) && (
                                            <div className="absolute -top-0.5 -right-0.5">
                                                <Crown className="h-3 w-3 text-yellow-500 fill-current" />
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex items-center justify-between">
                                            <span>My Account</span>
                                            {isPremiumActive(user) && (
                                                <PremiumBadge variant="compact" className="ml-2" />
                                            )}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    {user.role === 'user' && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link to="/profile#orders">Order History</Link>
                                            </DropdownMenuItem>
                                            {!isPremiumActive(user) && (
                                                <DropdownMenuItem asChild>
                                                    <Link to="/profile#premium" className="text-yellow-600 dark:text-yellow-500">
                                                        <Crown className="h-4 w-4 mr-2 inline fill-current" />
                                                        Upgrade to Premium
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                        </>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link to="/bookmarks">Bookmarks</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/notifications">Notifications</Link>
                                    </DropdownMenuItem>
                                    {user.role === 'restaurant' && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Restaurant</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link to="/restaurant/dashboard">Dashboard</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/restaurant/orders">Orders</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="shadow-sm">Sign up</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <div className="flex flex-col gap-4 mt-8">
                                    {user?.role === 'user' && (
                                        <>
                                            <Link to="/deals" className="text-lg font-medium">Browse Deals</Link>
                                            <Link
                                                to="/priority-deals"
                                                onClick={handlePriorityClick}
                                                className="text-lg font-medium flex items-center gap-2"
                                            >
                                                <Crown className="h-4 w-4 text-yellow-500" />
                                                Priority Deals
                                            </Link>
                                            <Link to="/restaurants" className="text-lg font-medium">Restaurants</Link>
                                        </>
                                    )}
                                    {user?.role === 'restaurant' && (
                                        <>
                                            <Link to="/restaurant/dashboard" className="text-lg font-medium">Dashboard</Link>
                                            <Link to="/restaurant/orders" className="text-lg font-medium">Orders</Link>
                                        </>
                                    )}
                                    {!user && (
                                        <div className="flex flex-col gap-2 mt-4">
                                            <Link to="/login">
                                                <Button variant="outline" className="w-full">Log in</Button>
                                            </Link>
                                            <Link to="/signup">
                                                <Button className="w-full">Sign up</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}
