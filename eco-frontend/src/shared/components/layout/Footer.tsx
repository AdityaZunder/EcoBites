import { Leaf } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container py-12 flex flex-col items-center text-center gap-6">
                <div className="space-y-4 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eco/10">
                            <Leaf className="h-4 w-4 text-eco" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">EcoBites</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Fighting food waste, one meal at a time. Connect with local restaurants and save money on delicious food.
                    </p>
                </div>

                <div className="text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} EcoBites. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
