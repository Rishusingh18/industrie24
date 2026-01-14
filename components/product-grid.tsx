"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart, addToWishlist, wishlist } = useCart()
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  const handleAddToWishlist = (product: Product) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const isInWishlist = wishlist.some((item) => item.id === product.id)
        return (
          <div
            key={product.id}
            className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.image_url || "/placeholder.svg?height=300&width=300&query=industrial part"}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`bg-white/90 hover:bg-white rounded-full ${isInWishlist ? "text-red-500" : ""}`}
                  onClick={() => handleAddToWishlist(product)}
                >
                  <Heart className="h-5 w-5" fill={isInWishlist ? "currentColor" : "none"} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 flex-1">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {product.category || "Industrial Parts"}
                </p>
                <h3 className="text-base font-bold line-clamp-2 mt-1 text-foreground">{product.name}</h3>
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              )}

              <div className="flex items-baseline justify-between mt-auto">
                <div>
                  <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    product.stock_quantity > 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
                <Button
                  size="icon"
                  className={`transition-colors ${
                    addedToCart === product.id ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
                  } text-primary-foreground`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                  title={addedToCart === product.id ? "Added to cart!" : "Add to cart"}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
