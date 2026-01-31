"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc?: string
}

export function ImageWithFallback({
    src,
    fallbackSrc = "/placeholder.svg?height=300&width=300&query=industrial part",
    alt,
    className,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className="relative h-full w-full">
            {isLoading && (
                <Skeleton className="absolute inset-0 h-full w-full z-10 animate-shimmer rounded-none" />
            )}
            <Image
                {...props}
                alt={alt}
                src={error ? fallbackSrc : src}
                onError={() => setError(true)}
                onLoad={() => setIsLoading(false)}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
            />
        </div>
    )
}
