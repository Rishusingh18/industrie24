"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function ProductManagementPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    company_name: "",
    product_type: "",
    model: "",
    name: "",
    price: "",
    image_url: "",
    description: "",
    category: "Bearings",
    stock_quantity: "0",
    sku: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      toast({
        title: "Success",
        description: "Product added successfully",
      })

      setFormData({
        company_name: "",
        product_type: "",
        model: "",
        name: "",
        price: "",
        image_url: "",
        description: "",
        category: "Bearings",
        stock_quantity: "0",
        sku: "",
      })

      fetchProducts()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Fill in all required fields to add a new product</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company_name" className="font-semibold">
                  Company Name *
                </Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Siemens"
                  required
                  className="border-border"
                />
              </div>

              {/* Product Type */}
              <div className="space-y-2">
                <Label htmlFor="product_type" className="font-semibold">
                  Product Type *
                </Label>
                <Input
                  id="product_type"
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleInputChange}
                  placeholder="e.g., Electric Motor"
                  required
                  className="border-border"
                />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model" className="font-semibold">
                  Model *
                </Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., SM-1500"
                  required
                  className="border-border"
                />
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Three Phase Electric Motor 1.5kW"
                  required
                  className="border-border"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="font-semibold">
                  Price (€) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="299.99"
                  required
                  className="border-border"
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stock_quantity" className="font-semibold">
                  Stock Quantity
                </Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="border-border"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold">
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option>Bearings</option>
                  <option>Motors</option>
                  <option>Pumps</option>
                  <option>Gearboxes</option>
                  <option>Fans</option>
                  <option>Compressors</option>
                  <option>Valves</option>
                  <option>Other</option>
                </select>
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku" className="font-semibold">
                  SKU (optional)
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                  className="border-border"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image_url" className="font-semibold">
                Product Image URL *
              </Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                required
                className="border-border"
              />
              {formData.image_url && (
                <div className="relative w-32 h-32 mt-2">
                  <Image src={formData.image_url || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description..."
                rows={4}
                className="border-border"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? "Adding Product..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
