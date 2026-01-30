"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("id")

    const whatsappNumber = "919718889253"
    // Default message matching checkout logic (recreated here for redundancy if needed, or just link to open chat)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi, I have a query regarding my Order ${orderId}`

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-muted-foreground">
                        <p>Thank you for your order.</p>
                        {orderId && <p className="font-medium mt-2 text-foreground">Order ID: {orderId}</p>}
                    </div>

                    <div className="rounded-lg bg-orange-50 p-4 text-sm text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        <p className="font-medium mb-1">Next Step</p>
                        <p>Contact with our order manager for further processes and query.</p>
                    </div>

                    <div className="space-y-3">
                        <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Contact via WhatsApp
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    )
}
