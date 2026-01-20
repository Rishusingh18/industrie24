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

  const { data: images } = await supabase.from("product_images").select("*").eq("product_id", product.id)



  return (
    <>
      <Header />
      <ProductDetail product={product} images={images || []} />
      <Footer />
    </>
  )
}
