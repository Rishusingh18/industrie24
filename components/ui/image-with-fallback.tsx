"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc?: string
}

export function ImageWithFallback({
    src,
    fallbackSrc = "/placeholder.svg?height=300&width=300&query=industrial part",
    alt,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false)

    return (
        <Image
            {...props}
            alt={alt}
            src={error ? fallbackSrc : src}
            onError={() => setError(true)}
        />
    )
}
