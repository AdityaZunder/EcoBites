import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8 text-center animate-in fade-in zoom-in duration-500",
                className
            )}
        >
            {Icon && (
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-sm">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
            )}
            <h3 className="mb-2 text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="mb-8 max-w-sm text-muted-foreground">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} size="lg" className="shadow-md hover:shadow-lg">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
