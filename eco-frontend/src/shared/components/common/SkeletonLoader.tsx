import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

interface SkeletonLoaderProps {
    type?: "card" | "list" | "detail";
    count?: number;
    className?: string;
}

export function SkeletonLoader({ type = "card", count = 3, className }: SkeletonLoaderProps) {
    if (className) {
        return (
            <>
                {Array.from({ length: count }).map((_, i) => (
                    <Skeleton key={i} className={className} />
                ))}
            </>
        );
    }

    if (type === "card") {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: count }).map((_, i) => (
                    <Card key={i} className="overflow-hidden border-none shadow-sm">
                        <div className="aspect-[4/3] w-full">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <CardHeader className="space-y-2 p-4">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Skeleton className="h-4 w-full" />
                            <div className="mt-2 flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (type === "list") {
        return (
            <div className="space-y-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4 shadow-sm">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}
