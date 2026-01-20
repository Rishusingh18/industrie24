"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const subtotal = cartTotal
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6 py-20 text-center">
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground">Start shopping to add items to your cart</p>
            <Link href="/products">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                      <div className="flex items-center gap-2 rounded-lg border">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center font-medium text-sm">{item.quantity || 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6 h-fit sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="pt-4 space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 h-11 text-base">Proceed to Checkout</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping & Returns</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Free shipping on orders over $100</p>
                <p>30-day return policy</p>
                <p>Secure payment with Stripe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
