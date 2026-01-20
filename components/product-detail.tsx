"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart, Check } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

interface ProductDetailProps {
  product: Product
  images: any[]
}

export function ProductDetail({ product, images }: ProductDetailProps) {
  // Parse images from comma-separated string in image_url or use fallback
  const rawImages = product.image_url ? product.image_url.split(',').map(u => u.trim()).filter(Boolean) : []

  // Also consider images from the separate table if they exist
  const extraImages = images?.map((img: any) => img.image_url || img.url).filter(Boolean) || []

  const allRawImages = [...rawImages, ...extraImages]

  // Deduplicate by base URL (ignoring query params like width) to fix scraper inefficiency
  const uniqueImagesMap = new Map()

  allRawImages.forEach(url => {
    try {
      const baseUrl = url.split('?')[0]
      // If we haven't seen this base URL, add it.
      // Optional: We could try to parse 'width' param and keep the largest, 
      // but for now, first-come (or last-come) is better than duplicates.
      // The provided list seems to have 300, 165, 360, 450. 
      // We probably want the largest or the default.
      // Let's just keep the first occurrence for simplicity, or overwrite if we want to be fancy.
      if (!uniqueImagesMap.has(baseUrl)) {
        uniqueImagesMap.set(baseUrl, url)
      }
    } catch (e) {
      // Fallback for invalid URLs
      if (!uniqueImagesMap.has(url)) uniqueImagesMap.set(url, url)
    }
  })

  const distinctImages = Array.from(uniqueImagesMap.values())

  const mainImage = distinctImages[0] || "/placeholder.svg?height=500&width=500&query=industrial part"
  const allImages = distinctImages.length > 0 ? distinctImages : [mainImage]

  const [selectedImage, setSelectedImage] = useState(mainImage)

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
          {/* Product Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full max-w-md overflow-hidden rounded-lg bg-muted mx-auto">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {(allImages.length > 1) && (
              <div className="grid grid-cols-4 gap-2 w-full">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square w-full overflow-hidden rounded-md border-2 ${selectedImage === img ? "border-primary" : "border-transparent"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-3xl font-bold text-foreground">
                  {/* Assuming price is in USD or generic currency based on context, user ref showed 'Rs.' and '$'. Keeping $ for now or dynamic if needed. Reference 1 has 'Rs.' but I'll stick to '$' as per current unless instructed otherwise. Actually, let's use global config if available. Keeping $ for consistency with existing code. */}
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">incl. VAT, plus shipping</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className={`h-3 w-3 rounded-full ${product.stock_quantity > 0 ? "bg-red-500" : "bg-gray-300"}`}></div>
                <span className="text-red-600 font-medium">
                  {product.stock_quantity > 0
                    ? `Only ${product.stock_quantity} available - order now!`
                    : "Out of Stock"}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm">
                <span className="font-semibold">Condition:</span>
                <span>Used</span> {/* Hardcoded for now based on 'Industrial Spare Parts' typically being used/refurbished or mixed. Could be prop. */}
              </div>

              {/* Trust Signals */}
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded-full bg-green-500 p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Payment on invoice - no account needed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded-full bg-green-500 p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded-full bg-green-500 p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Next day delivery available</span>
                </div>
              </div>

              {/* Availability Box */}
              <Card className="bg-muted/30 border-muted mb-8">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className="font-medium text-sm text-green-600">
                      {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">SKU</p>
                    <p className="font-mono text-sm font-medium">{product.sku || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>


              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* ... (Quantity selector code) */}

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
                  className={`w-full gap-2 transition-colors ${addedToCart ? "bg-green-600 hover:bg-green-700" : "bg-accent hover:bg-accent/90"
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
