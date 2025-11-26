import { MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PlaceholderMapProps {
    className?: string;
    label?: string;
}

export const PlaceholderMap = ({ className, label = "Location Map" }: PlaceholderMapProps) => {
    return (
        <div
            className={cn(
                "relative w-full h-full min-h-[200px] bg-muted/30 rounded-xl overflow-hidden flex items-center justify-center border border-border/50",
                className
            )}
        >
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Map Roads Simulation */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-0 w-full h-2 bg-foreground transform -rotate-12" />
                <div className="absolute top-0 left-1/3 w-2 h-full bg-foreground transform rotate-12" />
                <div className="absolute top-1/4 right-0 w-full h-2 bg-foreground transform rotate-45" />
            </div>

            {/* Pin */}
            <div className="relative z-10 flex flex-col items-center gap-2 animate-in zoom-in duration-500">
                <div className="relative">
                    <MapPin className="h-10 w-10 text-primary fill-primary/20 drop-shadow-lg" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
                </div>
                <span className="text-sm font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-border/50">
                    {label}
                </span>
            </div>
        </div>
    );
};
