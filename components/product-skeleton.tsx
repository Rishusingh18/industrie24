import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col h-full w-full">
            <div className="relative aspect-[4/3] bg-muted">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="flex flex-col gap-2 p-3 flex-1">
                <div>
                    <Skeleton className="h-3 w-1/3 mb-1" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3 mt-1" />
                </div>

                <div className="mt-2 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                <div className="flex items-baseline justify-between mt-auto pt-4">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                <div className="pt-2">
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}
