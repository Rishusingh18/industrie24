"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Currency = "EUR" | "USD" | "INR" | "GBP" | "CAD"

interface CurrencyContextType {
    currency: Currency
    setCurrency: (currency: Currency) => void
    convertPrice: (priceInEur: number) => { value: number; symbol: string; formatted: string }
    formatPrice: (priceInEur: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const EXCHANGE_RATES: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92, // 1 USD = 0.92 EUR
    INR: 83.5, // 1 USD = 83.5 INR
    GBP: 0.79, // 1 USD = 0.79 GBP
    CAD: 1.36, // 1 USD = 1.36 CAD
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    EUR: "€",
    USD: "$",
    INR: "₹",
    GBP: "£",
    CAD: "C$",
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>("USD")

    // Optional: Persist to local storage
    useEffect(() => {
        const saved = localStorage.getItem("preferred_currency")
        if (saved && (saved in EXCHANGE_RATES)) {
            setCurrency(saved as Currency)
        }
    }, [])

    const updateCurrency = (c: Currency) => {
        setCurrency(c)
        localStorage.setItem("preferred_currency", c)
    }

    const convertPrice = (priceInUsd: number) => {
        const rate = EXCHANGE_RATES[currency]
        const value = priceInUsd * rate
        const symbol = CURRENCY_SYMBOLS[currency]

        return {
            value,
            symbol,
            formatted: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value)
        }
    }

    const formatPrice = (priceInUsd: number) => {
        return convertPrice(priceInUsd).formatted
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, convertPrice, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider")
    }
    return context
}
