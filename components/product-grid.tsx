"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { Price } from "@/components/price"
import { useState } from "react"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart, addToWishlist, wishlist } = useCart()
  const { t } = useLanguage()
  const [addedToCart, setAddedToCart] = useState<number | null>(null)

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || undefined,
    })
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  const handleAddToWishlist = (product: Product) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || undefined,
    })
  }

  const router = useRouter()

  const handleCardClick = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
      {products.map((product) => {
        const isInWishlist = wishlist.some((item) => item.id === product.id)
        return (
          <div
            key={product.id}
            onClick={() => handleCardClick(product.id)}
            className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full w-full"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={product.image_url || "/placeholder.svg?height=300&width=300&query=industrial part"}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToWishlist(product)
                  }}
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors shadow-sm"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`h-6 w-6 transition-colors ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                      }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 flex-1">
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
                  <span className="text-2xl font-bold text-primary">
                    <Price amount={product.price} />
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${product.stock_quantity > 0
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                >
                  {product.stock_quantity > 0 ? t("products.in_stock") : t("products.out_of_stock")}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className={`w-full transition-all duration-300 ${addedToCart === product.id
                    ? "bg-green-600 hover:bg-green-700 scale-105"
                    : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                  disabled={product.stock_quantity === 0}
                >
                  {addedToCart === product.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2 animate-bounce" />
                      {t("products.added")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t("products.add_to_cart")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
