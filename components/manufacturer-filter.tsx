"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Factory } from "lucide-react"
import logos from "@/components/manufacturer-logos.json"

interface ManufacturerFilterProps {
    trigger?: React.ReactNode
}

export function ManufacturerFilter({ trigger }: ManufacturerFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [manufacturers, setManufacturers] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        if (isOpen && manufacturers.length === 0) {
            fetchManufacturers()
        }
    }, [isOpen])

    const fetchManufacturers = async () => {
        setLoading(true)
        try {
            // Heuristic: Fetch top 2000 products to get most relevant brands
            const { data, error } = await supabase
                .from("products")
                .select("company_name")
                .not("company_name", "is", null)
                .limit(2000)

            if (data) {
                const unique = Array.from(new Set(data.map((p) => p.company_name))).filter(Boolean).sort()
                setManufacturers(unique)
            }
        } catch (error) {
            console.error("Error fetching manufacturers", error)
        } finally {
            setLoading(false)
        }
    }

    const filtered = manufacturers.filter((m) =>
        m.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelect = (brand: string) => {
        router.push(`/products?category=all&search=${encodeURIComponent(brand)}`)
        setIsOpen(false)
    }

    const logoMap = logos as Record<string, string>

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <Factory className="h-4 w-4" />
                        Manufacturers
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-background w-full max-w-5xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col border border-border">

                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Filter by Manufacturer</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b bg-muted/30">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search brands..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto p-4 content-start">
                            {loading ? (
                                <div className="flex justify-center py-10">Loading brands...</div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filtered.map((brand) => {
                                        // Try to match brand name to logo keys (case insensitive / fuzzy)
                                        // Simple normalization for matching
                                        const normalizedBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, "")
                                        const logoKey = Object.keys(logoMap).find(k =>
                                            k.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedBrand ||
                                            k.toLowerCase().includes(normalizedBrand) ||
                                            normalizedBrand.includes(k.toLowerCase())
                                        )
                                        const logoUrl = logoKey ? logoMap[logoKey] : null

                                        return (
                                            <button
                                                key={brand}
                                                onClick={() => handleSelect(brand)}
                                                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent hover:border-primary/50 transition-all text-center aspect-[3/2] gap-3 bg-card"
                                            >
                                                {logoUrl ? (
                                                    <div className="h-12 w-full flex items-center justify-center relative">
                                                        <img
                                                            src={logoUrl}
                                                            alt={brand}
                                                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                        <Factory className="h-6 w-6" />
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium leading-tight line-clamp-2">{brand}</span>
                                            </button>
                                        )
                                    })}

                                    {filtered.length === 0 && (
                                        <div className="col-span-full text-center py-10 text-muted-foreground">
                                            No brands found matching "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t bg-muted/10 text-xs text-muted-foreground flex justify-between">
                            <span>{manufacturers.length} Brands Available</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
