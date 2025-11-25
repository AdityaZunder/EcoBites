import { cn } from "@/shared/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <div className={cn("mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
                {description && <p className="text-lg text-muted-foreground">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-4">{children}</div>}
        </div>
    );
}
