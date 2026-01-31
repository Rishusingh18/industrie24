"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, ShoppingCart, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function DashboardGalleries() {
    const router = useRouter()
    const { cart, wishlist } = useCart()
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()


    return (
        <div className="space-y-6">
            {/* My Orders */}
            <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push('/orders')}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="h-7 w-7 text-teal-600" />
                        <CardTitle className="text-lg">My Orders</CardTitle>
                    </div>
                    <span className="text-sm font-bold text-teal-600 hover:underline">View All</span>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-20 flex items-center justify-center">
                            <span className="text-sm text-gray-400">Loading...</span>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {orders.map((order) => (
                                <div key={order.id} className="min-w-[160px] h-40 bg-white border rounded-lg flex items-center justify-center relative overflow-hidden flex-col gap-1 p-2 hover:border-teal-500 transition-colors">
                                    <div className="flex gap-2 justify-center w-full h-full items-center">
                                        {order.order_items?.slice(0, 2).map((item: any, idx: number) => (
                                            <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-50/50">
                                                <ImageWithFallback
                                                    src={item.products?.image_url || "/placeholder.svg"}
                                                    alt="Order Item"
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-accent/5 rounded-lg border border-dashed border-border/50">
                            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                                <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-base font-medium text-foreground">No orders yet</p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                                When you place an order, it will appear here.
                            </p>
                            <Button variant="link" asChild className="mt-2 text-teal-600 px-0 h-auto font-normal text-xs">
                                <Link
                                    href="/"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Start Shopping
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Wishlist */}
                <Link href="/wishlist" className="block h-full">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                                <Heart className="h-7 w-7 text-red-600" />
                                <CardTitle className="text-lg">Wishlist</CardTitle>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            {wishlist.length > 0 ? (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {wishlist.slice(0, 4).map((item) => (
                                        <div key={item.id} className="relative h-24 w-24 min-w-[96px] rounded border bg-white overflow-hidden">
                                            <ImageWithFallback
                                                src={item.image_url || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                    ))}
                                    {wishlist.length > 4 && (
                                        <div className="h-24 w-24 min-w-[96px] rounded border bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                                            +{wishlist.length - 4}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
                            )}
                        </CardContent>
                    </Card>
                </Link>

                {/* Cart */}
                <Link href="/cart" className="block h-full">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="h-7 w-7 text-teal-600" />
                                <CardTitle className="text-lg">My Cart</CardTitle>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            {cart.length > 0 ? (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {cart.slice(0, 4).map((item) => (
                                        <div key={item.id} className="relative h-24 w-24 min-w-[96px] rounded border bg-white overflow-hidden">
                                            <ImageWithFallback
                                                src={item.image_url || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-1"
                                            />
                                            <span className="absolute bottom-0 right-0 bg-teal-600 text-white text-[10px] px-1 rounded-tl">
                                                x{item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                    {cart.length > 4 && (
                                        <div className="h-24 w-24 min-w-[96px] rounded border bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                                            +{cart.length - 4}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Your cart is empty</p>
                            )}
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
