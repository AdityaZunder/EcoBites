import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";
import { CartProvider } from "@/shared/contexts/CartContext";
import { OrderProvider } from "@/shared/contexts/OrderContext";
import { Layout } from "@/shared/components/layout/Layout";
import { MarketplaceProvider } from "@/shared/contexts/MarketplaceContext";
import { PremiumModalProvider } from "@/shared/contexts/PremiumModalContext";
import Index from "@/shared/pages/Index";
import Login from "@/shared/pages/Login";
import Signup from "@/shared/pages/Signup";
import Deals from "@/apps/user/pages/Deals";
import PriorityDeals from "@/apps/user/pages/PriorityDeals";
import Restaurants from "@/apps/user/pages/Restaurants";
import ListingDetail from "@/apps/user/pages/ListingDetail";
import UserProfile from "@/apps/user/pages/UserProfile";
import Bookmarks from "@/apps/user/pages/Bookmarks";
import Notifications from "@/apps/user/pages/Notifications";
import RestaurantDashboard from "@/apps/restaurant/pages/RestaurantDashboard";
import CreateListing from "@/apps/restaurant/pages/CreateListing";
import RestaurantOrders from "@/apps/restaurant/pages/RestaurantOrders";
import RestaurantProfile from "@/apps/restaurant/pages/RestaurantProfile";
import Cart from "@/apps/user/pages/Cart";
import Checkout from "@/apps/user/pages/Checkout";
import OrderConfirmation from "@/apps/user/pages/OrderConfirmation";
import NotFound from "@/shared/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <MarketplaceProvider>
              <PremiumModalProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/deals" element={<Deals />} />
                        <Route path="/priority-deals" element={<PriorityDeals />} />
                        <Route path="/restaurants" element={<Restaurants />} />
                        <Route path="/listing/:id" element={<ListingDetail />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/bookmarks" element={<Bookmarks />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
                        <Route path="/restaurant/create-listing" element={<CreateListing />} />
                        <Route path="/restaurant/orders" element={<RestaurantOrders />} />
                        <Route path="/restaurant/profile" element={<RestaurantProfile />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </PremiumModalProvider>
            </MarketplaceProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
