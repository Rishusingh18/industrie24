"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCart()

  if (wishlist.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-[98%] px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Link href="/products" className="text-teal-600 hover:text-teal-700 flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Link>
            </div>

            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
              <p className="text-muted-foreground mb-8">Start adding items to your wishlist to save them for later</p>
              <Link href="/products">
                <Button className="bg-teal-600 hover:bg-teal-700">Browse Products</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[98%] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/products" className="text-teal-600 hover:text-teal-700 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-8">My Wishlist ({wishlist.length} items)</h1>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={item.image_url || "/placeholder.svg?height=300&width=300&query=industrial part"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                  <p className="text-2xl font-bold text-teal-600">${item.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-teal-600 hover:bg-teal-700 gap-2" onClick={() => addToCart(item)}>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => removeFromWishlist(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
