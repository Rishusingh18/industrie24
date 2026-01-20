"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductGrid } from "@/components/product-grid"

import { ManufacturerFilter } from "@/components/manufacturer-filter"
import { Search, X } from "lucide-react"

interface ProductsContentProps {
  initialProducts: Product[]
  totalProducts?: number
  currentPage?: number
}

export function ProductsContent({ initialProducts, totalProducts = 0, currentPage = 1 }: ProductsContentProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  // We rely on server for main filtering now, local search is still useful for small sets 
  // but might be confusing if pagination exists. Ideally search should also be server side.
  // For now let's keep local filtering on the CURRENT PAGE data only, which is the standard behavior for mixed modes.

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)

  useEffect(() => {
    // Update local state when server data changes (e.g. page change)
    setFilteredProducts(initialProducts)
  }, [initialProducts])

  // Local filtering effect (optional, might remove if purely server side)
  useEffect(() => {
    let filtered = initialProducts
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.product_type && p.product_type.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
    setFilteredProducts(filtered)
  }, [searchQuery, initialProducts])

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  const router = useRouter()

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    router.push("/products")
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/products?${params.toString()}`)
  }

  const pageSize = 48
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalProducts)
  const totalPages = Math.ceil(totalProducts / pageSize)

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

          {/* Active Filters */}
          {searchQuery && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Active filters:</span>
              <Badge variant="secondary" className="gap-1 pr-1">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove search filter</span>
                </button>
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="ml-auto text-muted-foreground h-7">
                Clear all
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-muted-foreground">
              {totalProducts > 0
                ? `Showing ${startItem}-${endItem} of ${totalProducts} results`
                : "No products found"}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center px-2 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <ProductGrid products={filteredProducts} />

            {/* Bottom Pagination */}
            <div className="flex items-center justify-between mt-8 border-t pt-4">
              <div className="text-sm text-muted-foreground">
                {totalProducts > 0
                  ? `Showing ${startItem}-${endItem} of ${totalProducts} results`
                  : ""}
              </div>

              {totalPages > 1 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-2 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </>
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
