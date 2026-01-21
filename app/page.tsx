import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { Footer } from "@/components/footer"


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
      <FeaturedProducts products={products} />
      <Footer />
    </>
  )
}
