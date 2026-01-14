"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductGrid } from "@/components/product-grid"
import { Search, X } from "lucide-react"

interface ProductsContentProps {
  initialProducts: Product[]
}

export function ProductsContent({ initialProducts }: ProductsContentProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)

  useEffect(() => {
    let filtered = products

    if (selectedCategory && selectedCategory !== "all") {
      const categoryMap: { [key: string]: string } = {
        automation: "Automation",
        "servo-motors": "Servo Motors",
        sensors: "Sensors",
        "drive-technology": "Drive Technology",
        pneumatics: "Pneumatics",
        "ball-bearing": "Ball-Bearing",
        pumps: "Pumps",
        valves: "Valves",
      }

      const productType = categoryMap[selectedCategory]
      if (productType) {
        filtered = filtered.filter((p) => p.product_type === productType)
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.product_type?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory])

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
          {selectedCategory && selectedCategory !== "all"
            ? selectedCategory
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "Product Catalog"}
        </h1>

        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name, type, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedCategory) && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-muted-foreground">No products found</p>
            <Button variant="link" onClick={handleClearFilters} className="mt-4">
              Clear filters and try again
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
