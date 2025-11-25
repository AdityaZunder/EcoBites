import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";

export function Layout() {
    const { user } = useAuth();
    const location = useLocation();

    // Routes that have their own custom headers
    const customHeaderRoutes = [
        '/profile',
        '/restaurant/dashboard',
        '/restaurant/create-listing',
        '/restaurant/orders',
        '/restaurant/profile'
    ];

    const shouldShowNavbar = !customHeaderRoutes.some(route => location.pathname.startsWith(route));

    return (
        <div className="flex min-h-screen flex-col">
            {shouldShowNavbar && <Navbar />}
            <main className="flex-1">
                <Outlet />
            </main>
            {!user && <Footer />}
        </div>
    );
}
