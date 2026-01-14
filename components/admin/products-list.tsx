"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface Product {
  id: number
  name: string
  company_name: string
  model: string
  price: number
  stock_quantity: number
  image_url: string
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading products...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Inventory</CardTitle>
        <CardDescription>Total products: {products.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition"
            >
              {product.image_url && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.company_name} - Model: {product.model}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-primary">€{product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
