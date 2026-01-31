import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "@/components/product-skeleton"


export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("products")
    .select("id, name, price, image_url, category, sku, stock_quantity")
    .eq("is_featured", true)
    .limit(8)
  const products = data || []



  return (
    <>
      <Header />
      <HeroSection />
      <Suspense fallback={
        <div className="container py-8 space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      }>
        <FeaturedProducts products={products} />
      </Suspense>
      <Footer />
    </>
  )
}
