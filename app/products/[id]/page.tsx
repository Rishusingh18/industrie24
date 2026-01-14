import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", Number.parseInt(id)).single()

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </>
  )
}
