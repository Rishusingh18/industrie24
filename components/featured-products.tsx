"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Products</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our most popular industrial components and spare parts
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={product.image_url || "/placeholder.svg?height=300&width=300&query=industrial part"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="line-clamp-1 text-base">{product.name}</CardTitle>
                <CardDescription className="line-clamp-1 text-xs">{product.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                  <span
                    className={`text-xs font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button size="icon" className="bg-accent hover:bg-accent/90">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
