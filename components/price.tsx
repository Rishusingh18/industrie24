"use client"

import { useCurrency } from "@/lib/currency-context"

interface PriceProps {
    amount: number
    className?: string
}

export function Price({ amount, className = "" }: PriceProps) {
    const { formatPrice } = useCurrency()

    // amount is expected to be in EUR (base currency)
    return <span className={className}>{formatPrice(amount)}</span>
}
