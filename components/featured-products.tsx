"use client"

import { useState } from "react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { ShoppingCart, Heart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { Price } from "@/components/price"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useCart()
  const [addedToCart, setAddedToCart] = useState<number | null>(null)

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId)
  }

  const toggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // Prevent navigation if clicking the heart
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || undefined,
        quantity: 1
      })
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || undefined,
      quantity: 1
    })

    // Trigger animation
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  const { t } = useLanguage()

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-[98%] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("featured.title")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("featured.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <Card key={product.id} className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative group">
              {/* Wishlist Button - Top Right */}
              <button
                onClick={(e) => toggleWishlist(e, product)}
                className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors shadow-sm"
                aria-label="Add to wishlist"
                suppressHydrationWarning
              >
                <Heart
                  className={`h-6 w-6 transition-colors ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                    }`}
                />
              </button>

              <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                  <ImageWithFallback
                    src={product.image_url || "/placeholder.svg?height=300&width=300&query=industrial part"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={index < 4}
                  />
                </div>
              </Link>
              <CardHeader className="p-4 pb-2">
                <Link href={`/products/${product.id}`} className="block">
                  <CardTitle className="line-clamp-1 text-base group-hover:text-teal-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 text-xs">{product.category}</CardDescription>
                </Link>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-primary">
                    <Price amount={product.price} />
                  </span>
                  <span
                    className={`text-xs font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.stock_quantity > 0 ? t("products.in_stock") : t("products.out_of_stock")}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    className={`w-full transition-all duration-300 ${addedToCart === product.id
                      ? "bg-green-600 hover:bg-green-700 scale-105"
                      : "bg-teal-600 hover:bg-teal-700"
                      }`}
                    onClick={(e) => handleAddToCart(e, product)}
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
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">
              {t("products.view_all")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
