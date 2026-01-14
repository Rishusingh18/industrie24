import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { Footer } from "@/components/footer"
import { revalidateTag } from "next/cache"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient()

  const { data: products = [] } = await supabase.from("products").select("*").limit(8)

  // Revalidate products tag for fresh data
  revalidateTag("products")

  return (
    <>
      <Header />
      <HeroSection />
      <FeaturedProducts products={products} />
      <Footer />
    </>
  )
}
