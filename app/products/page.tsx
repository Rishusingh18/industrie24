import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsContent } from "@/components/products-content"
import type { Product } from "@/lib/types"
import { revalidateTag } from "next/cache"

async function ProductsServer() {
  const supabase = await createClient()
  const { data: products = [] } = await supabase.from("products").select("*")

  // Revalidate products tag every 60 seconds to keep data fresh
  revalidateTag("products")

  return <ProductsContent initialProducts={products as Product[]} />
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProductsServer />
      </Suspense>
      <Footer />
    </>
  )
}
