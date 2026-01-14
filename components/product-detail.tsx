"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart, addToWishlist, wishlist } = useCart()
  const isInWishlist = wishlist.some((item) => item.id === product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      })
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="aspect-square w-full max-w-md overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image_url || "/placeholder.svg?height=500&width=500&query=industrial part"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 inline-block rounded-full bg-accent/10 px-4 py-1">
                <p className="text-sm font-medium text-accent">{product.category}</p>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
              <p className="mt-2 text-muted-foreground">{product.description}</p>
            </div>

            {/* Price and Stock */}
            <div className="space-y-4 border-y py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-5xl font-bold text-primary">${product.price.toFixed(2)}</span>
                <span
                  className={`text-lg font-medium ${product.stock_quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2 rounded-lg border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className={`w-full gap-2 transition-colors ${
                  addedToCart ? "bg-green-600 hover:bg-green-700" : "bg-accent hover:bg-accent/90"
                }`}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>

              <Button size="lg" variant="outline" className="w-full bg-transparent" onClick={handleAddToWishlist}>
                <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? "fill-current" : ""}`} />
                {isInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
              </Button>

              <Button size="lg" variant="outline" className="w-full bg-transparent">
                Contact for Bulk Order
              </Button>
            </div>

            {/* Product Specs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-mono text-sm font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6 space-y-4">
              <p className="text-base text-muted-foreground">{product.description}</p>
              <p className="text-base text-muted-foreground">
                This product is a high-quality industrial component suitable for demanding applications. It has been
                rigorously tested and meets international standards for reliability and performance.
              </p>
            </TabsContent>
            <TabsContent value="specs" className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quality Assurance</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    All products meet ISO 9001 standards and have been tested for durability and reliability.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Warranty</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    12-month manufacturer warranty included. Extended warranties available upon request.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Domestic Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    Orders typically ship within 2-3 business days. Delivery time is 3-5 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">International Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    We ship worldwide. International orders may take 7-14 business days for delivery.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
