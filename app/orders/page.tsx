"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PackageOpen, ArrowLeft, Calendar, FileText, MapPin, ChevronDown, ChevronUp, Search, Truck, CheckCircle2, RotateCcw, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useCurrency } from "@/lib/currency-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { format } from "date-fns"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [filteredOrders, setFilteredOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("orders")

    const supabase = createClient()
    const { formatPrice } = useCurrency()
    const { addToCart } = useCart()
    const router = useRouter()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsLoading(false)
                return
            }

            const { data, error } = await supabase
                .from("orders")
                .select(`
                    id,
                    order_id,
                    status,
                    created_at,
                    total_amount,
                    shipping_address,
                    billing_address,
                    order_items (
                        quantity,
                        price,
                        products (
                            id,
                            name,
                            image_url,
                            price
                        )
                    )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("Error fetching orders:", error)
                toast.error("Failed to load orders")
            } else {
                setOrders(data || [])
                setFilteredOrders(data || [])
            }
        } catch (error) {
            console.error("Failed to fetch orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Filtering Logic
    useEffect(() => {
        let result = orders

        // Tab Filter
        if (activeTab === "not-shipped") {
            result = result.filter(order => order.status === "Pending" || order.status === "Processing")
        } else if (activeTab === "cancelled") {
            result = result.filter(order => order.status === "Cancelled")
        }
        // "Buy Again" currently just shows all, but could filter for 'Delivered' in future

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(order =>
                order.order_id?.toLowerCase().includes(query) ||
                order.order_items?.some((item: any) => item.products?.name?.toLowerCase().includes(query))
            )
        }

        setFilteredOrders(result)
    }, [searchQuery, activeTab, orders])

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId)
    }

    const handleBuyAgain = (product: any) => {
        if (!product) return
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: 1
        })
        toast.success("Added to Cart. Redirecting to Checkout...")
        router.push("/checkout")
    }

    const handleCancelOrder = async (orderId: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: 'Cancelled' })
                .eq('id', orderId)

            if (error) throw error

            toast.success("Order cancelled successfully")
            // Refresh orders immediately
            const updatedOrders = orders.map(o =>
                o.id === orderId ? { ...o, status: 'Cancelled' } : o
            )
            setOrders(updatedOrders)
        } catch (error) {
            console.error("Error cancelling order:", error)
            toast.error("Failed to cancel order")
        }
    }

    const handleTrackPackage = () => {
        // Just a mock handler for the button if not using the Dialog trigger directly
        // But we use DialogTrigger below
    }

    const handleInvoice = () => {
        toast.message("Downloading Invoice...", {
            description: "This is a simulation.",
        })
    }

    const handleReview = () => {
        toast.info("Redirecting to review form...")
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[80vh] font-sans">
            {/* Breadcrumb / Layout Header */}
            <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-2">
                    <Link href="/account" className="hover:underline hover:text-[#C7511F]">Your Account</Link> › <span>Your Orders</span>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
                    <h1 className="text-3xl font-normal text-[#0F1111]">Your Orders</h1>
                    <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search all orders"
                            className="pl-9 rounded-full border-gray-300 focus:border-[#e77600] focus:ring-[#e77600] shadow-[0_1px_2px_rgba(15,17,17,0.15)_inset]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button className="absolute right-0 top-0 rounded-l-none rounded-r-full bg-[#303333] hover:bg-[#1c1e1e] h-full px-5 text-white">Search</Button>
                    </div>
                </div>
            </div>

            {/* Tabs / Filters */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                <div className="flex gap-6 min-w-max">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`pb-3 border-b-[3px] text-sm ${activeTab === "orders" ? "border-[#C7511F] font-bold text-[#0F1111]" : "border-transparent hover:border-gray-300 text-[#007185] hover:text-[#C7511F] font-medium"}`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("buy-again")}
                        className={`pb-3 border-b-[3px] text-sm ${activeTab === "buy-again" ? "border-[#C7511F] font-bold text-[#0F1111]" : "border-transparent hover:border-gray-300 text-[#007185] hover:text-[#C7511F] font-medium"}`}
                    >
                        Buy Again
                    </button>
                    <button
                        onClick={() => setActiveTab("not-shipped")}
                        className={`pb-3 border-b-[3px] text-sm ${activeTab === "not-shipped" ? "border-[#C7511F] font-bold text-[#0F1111]" : "border-transparent hover:border-gray-300 text-[#007185] hover:text-[#C7511F] font-medium"}`}
                    >
                        Not Yet Shipped
                    </button>
                    <button
                        onClick={() => setActiveTab("cancelled")}
                        className={`pb-3 border-b-[3px] text-sm ${activeTab === "cancelled" ? "border-[#C7511F] font-bold text-[#0F1111]" : "border-transparent hover:border-gray-300 text-[#007185] hover:text-[#C7511F] font-medium"}`}
                    >
                        Cancelled Orders
                    </button>
                </div>
            </div>

            <div className="mb-4 text-sm text-[#0F1111]">
                <span className="font-bold">{filteredOrders.length} orders</span> placed
            </div>

            {filteredOrders.length === 0 ? (
                <div className="p-8 border border-gray-200 rounded-lg bg-white text-center shadow-sm">
                    <h2 className="text-lg font-medium text-[#0F1111]">You have no orders matching these filters.</h2>
                    <Button asChild className="mt-4 bg-[#F7CA00] hover:bg-[#F2C200] text-[#0F1111] border border-[#FCD200] shadow-sm rounded-lg px-8">
                        <Link href="/">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="border border-[#D5D9D9] rounded-lg overflow-hidden bg-white">
                            {/* Order Header */}
                            <div className="bg-[#F0F2F2] px-4 py-3 border-b border-[#D5D9D9] text-sm text-[#565959]">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                                        <div className="flex flex-col">
                                            <span className="uppercase text-xs font-medium">Order Placed</span>
                                            <span className="text-[#0F1111]">{format(new Date(order.created_at), "dd MMMM yyyy")}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="uppercase text-xs font-medium">Total</span>
                                            <span className="text-[#0F1111]">{formatPrice(order.total_amount)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="uppercase text-xs font-medium">Ship To</span>
                                            <div className="relative group">
                                                <button className="flex items-center gap-1 text-[#007185] hover:text-[#C7511F] hover:underline outline-none text-left">
                                                    {order.shipping_address?.firstName} {order.shipping_address?.lastName} <ChevronDown className="h-3 w-3" />
                                                </button>
                                                {/* Simple Hover Dropdown for address */}
                                                <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10 text-[#0F1111]">
                                                    <p className="font-bold mb-1">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
                                                    <p>{order.shipping_address?.address}</p>
                                                    <p>{order.shipping_address?.city}, {order.shipping_address?.state}, {order.shipping_address?.zipCode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:items-end">
                                        <div className="flex gap-2 text-[#0F1111]">
                                            <span className="uppercase text-xs font-medium mt-0.5">Order #</span>
                                            <span>{order.order_id}</span>
                                        </div>
                                        <div className="flex gap-4 mt-1 text-sm">
                                            <Link href={`/order-confirmation?id=${order.order_id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline">
                                                View order details
                                            </Link>
                                            <span className="text-gray-300">|</span>
                                            <button onClick={handleInvoice} className="text-[#007185] hover:text-[#C7511F] hover:underline">
                                                Invoice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between mb-4">
                                    <h3 className="text-lg font-bold text-[#0F1111] mb-2 sm:mb-0">
                                        {order.status === 'Pending' ? 'Arriving soon' :
                                            order.status === 'Cancelled' ? 'Cancelled' : 'Delivered'}
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {order.order_items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                            {/* Image */}
                                            <div className="shrink-0 flex justify-center sm:block">
                                                <Link href={`/products/${item.products?.id}`}>
                                                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0">
                                                        <Image
                                                            src={item.products?.image_url || "/placeholder.svg"}
                                                            alt={item.products?.name || "Product"}
                                                            fill
                                                            className="object-contain object-center"
                                                        />
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 space-y-1 text-center sm:text-left">
                                                <Link href={`/products/${item.products?.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium line-clamp-2">
                                                    {item.products?.name || "Unknown Product"}
                                                </Link>
                                                <p className="text-sm text-[#0F1111]">Qty: {item.quantity}</p>
                                                <p className="text-sm text-[#565959]">Price: {formatPrice(item.price)}</p>

                                                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                                                    <Button
                                                        onClick={() => handleBuyAgain(item.products)}
                                                        size="sm"
                                                        className="bg-[#F7CA00] hover:bg-[#F2C200] text-[#0F1111] border border-[#FCD200] shadow-sm rounded-md text-xs font-medium h-8 px-3"
                                                    >
                                                        <RotateCcw className="w-3 h-3 mr-1" /> Buy it again
                                                    </Button>
                                                    <Button asChild size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50 text-[#0F1111] rounded-md text-xs font-medium h-8 px-3">
                                                        <Link href={`/products/${item.products?.id}`}>View your item</Link>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Right Actions */}
                                            <div className="flex flex-col gap-2 w-full sm:w-52 shrink-0 pt-2 sm:pt-0">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="w-full border-gray-300 shadow-sm rounded-lg hover:bg-gray-50 text-sm h-8">
                                                            Track package
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Package Status</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="py-6">
                                                            <div className={`flex items-center gap-4 mb-8 p-3 rounded-lg ${order.status === 'Cancelled' ? 'bg-red-50' : 'bg-green-50'}`}>
                                                                <div className={`p-2 rounded-full ${order.status === 'Cancelled' ? 'bg-red-100' : 'bg-green-100'}`}>
                                                                    {order.status === 'Cancelled' ? (
                                                                        <XCircle className="h-6 w-6 text-red-700" />
                                                                    ) : (
                                                                        <Truck className="h-6 w-6 text-green-700" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className={`font-bold ${order.status === 'Cancelled' ? 'text-red-700' : 'text-green-700'}`}>
                                                                        {order.status === 'Pending' ? 'Ordered' : order.status}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {order.status === 'Pending' ? 'We have received your order.' :
                                                                            order.status === 'Cancelled' ? 'This order has been cancelled.' :
                                                                                'Your item is on the way.'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {order.status !== 'Cancelled' && (
                                                                <div className="relative pl-4 border-l-2 border-gray-200 space-y-8 ml-3">
                                                                    {/* Timeline Item 2 (Latest) */}
                                                                    {order.status === 'Delivered' && (
                                                                        <div className="relative">
                                                                            <div className="absolute -left-[21px] bg-green-500 h-3 w-3 rounded-full ring-4 ring-white"></div>
                                                                            <p className="text-sm font-bold">Delivered</p>
                                                                            <p className="text-xs text-gray-500">Package arrived.</p>
                                                                        </div>
                                                                    )}

                                                                    {/* Timeline Item 1 */}
                                                                    <div className="relative">
                                                                        <div className="absolute -left-[21px] bg-green-500 h-3 w-3 rounded-full ring-4 ring-white"></div>
                                                                        <p className="text-sm font-bold">Ordered</p>
                                                                        <p className="text-xs text-gray-500">Order placed on {format(new Date(order.created_at), "dd MMMM")}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {order.status === 'Pending' && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" className="w-full border-gray-300 shadow-sm rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm h-8">
                                                                Cancel Order
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Cancel Order?</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="py-4">
                                                                <p className="text-sm text-gray-600">Are you sure you want to cancel this order? This action cannot be undone.</p>
                                                            </div>
                                                            <DialogFooter className="gap-2 sm:gap-0">
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">No, Keep Order</Button>
                                                                </DialogClose>
                                                                <DialogClose asChild>
                                                                    <Button onClick={() => handleCancelOrder(order.id)} variant="destructive">Yes, Cancel Order</Button>
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}

                                                <Button onClick={handleReview} variant="outline" className="w-full border-gray-300 shadow-sm rounded-lg hover:bg-gray-50 text-sm h-8">
                                                    Write a product review
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border-t border-[#D5D9D9] px-4 py-3">
                                <Link href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm">
                                    Archive order
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
