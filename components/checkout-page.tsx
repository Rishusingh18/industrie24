"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCurrency } from "@/lib/currency-context"

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { formatPrice } = useCurrency()
  const router = useRouter()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState("shipping")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  // Billing state
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })
  const [sameAsShipping, setSameAsShipping] = useState(true)

  // Sync billing with shipping when checked
  useEffect(() => {
    if (sameAsShipping) {
      setBillingData(prev => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }))
    }
  }, [sameAsShipping, formData])

  // Handle billing input change
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBillingData(prev => ({ ...prev, [name]: value }))
  }

  // Fetch user data
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user) {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        const metadata = user.user_metadata || {}

        // Combine profile data (DB) and metadata (Auth)
        const firstName = (profile?.full_name || metadata.full_name || "").split(" ")[0] || ""
        const lastName = (profile?.full_name || metadata.full_name || "").split(" ").slice(1).join(" ") || ""

        setFormData(prev => ({
          ...prev,
          email: user.email || "",
          // Address from profile DB (source of truth for street)
          address: profile?.address || prev.address,
          // Extended fields from metadata
          city: metadata.city || prev.city,
          state: metadata.state || prev.state,
          zipCode: metadata.zip_code || prev.zipCode,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          // phone: profile?.phone || prev.phone
        }))
      }
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Generate a random Order ID (e.g., ORD-2024-1234)
  const generateOrderId = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(1000 + Math.random() * 9000)
    return `ORD-${year}-${random}`
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsSubmitting(true)

    try {
      const orderId = generateOrderId()

      // Prepare full address snapshots
      const shippingAddressSnapshot = formData
      const billingAddressSnapshot = sameAsShipping ? formData : billingData

      // 1. Create Order with snapshots
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: cartTotal,
          status: "Pending",
          order_id: orderId,
          shipping_address: shippingAddressSnapshot,
          billing_address: billingAddressSnapshot,
          stripe_payment_intent_id: "whatsapp_pending"
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. Clear Cart
      clearCart()

      // 4. WhatsApp Redirection
      const phoneNumber = "919718889253" // +91 97188 89253

      // Format items list for message
      const itemsList = cart.map(item =>
        `- ${item.name} (x${item.quantity})`
      ).join("\n")

      const message = encodeURIComponent(
        `*New Order Placed!* 🛍️
Order ID: ${orderId}

*Items:*
${itemsList}

*Total:* ${formatPrice(total)}

*Customer Details:*
Name: ${shippingAddressSnapshot.firstName} ${shippingAddressSnapshot.lastName}
Email: ${shippingAddressSnapshot.email}
Address: ${shippingAddressSnapshot.address}, ${shippingAddressSnapshot.city}, ${shippingAddressSnapshot.state}, ${shippingAddressSnapshot.zipCode}

I would like to proceed with this order.`
      )

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank')

      toast.success("Order placed successfully!")
      router.push(`/order-confirmation?id=${orderId}`)

    } catch (error: any) {
      console.error("Checkout error:", JSON.stringify(error, null, 2))
      if (error?.message) {
        console.error("Error message:", error.message);
      }
      toast.error("Failed to place order: " + (error?.message || "Unknown error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const tax = cartTotal * 0.1 // 10% tax mock
  const total = cartTotal + tax

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-[98%] px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Tabs value={currentStep} onValueChange={setCurrentStep}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="NY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <Button onClick={() => setCurrentStep("billing")} className="w-full">
                      Continue to Billing
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg bg-muted p-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsShipping}
                          onChange={(e) => setSameAsShipping(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm">Same as shipping address</span>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          name="firstName"
                          value={billingData.firstName}
                          onChange={handleBillingChange}
                          placeholder="John"
                          disabled={sameAsShipping}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          name="lastName"
                          value={billingData.lastName}
                          onChange={handleBillingChange}
                          placeholder="Doe"
                          disabled={sameAsShipping}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input
                        name="address"
                        value={billingData.address}
                        onChange={handleBillingChange}
                        placeholder="123 Main Street"
                        disabled={sameAsShipping}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          name="city"
                          value={billingData.city}
                          onChange={handleBillingChange}
                          placeholder="New York"
                          disabled={sameAsShipping}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          name="state"
                          value={billingData.state}
                          onChange={handleBillingChange}
                          placeholder="NY"
                          disabled={sameAsShipping}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input
                          name="zipCode"
                          value={billingData.zipCode}
                          onChange={handleBillingChange}
                          placeholder="10001"
                          disabled={sameAsShipping}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                    >
                      {isSubmitting ? "Processing..." : `Place Order & Chat on WhatsApp - ${formatPrice(total)}`}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 h-fit sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{cart.length} Items</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Guarantees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Secure SSL encryption</p>
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ Free technical support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
