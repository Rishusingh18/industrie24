import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsContent } from "@/components/products-content"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

async function ProductsServer({
  category,
  page = 1,
  search,
}: {
  category?: string
  page?: number
  search?: string
}) {
  const supabase = await createClient()

  // Base query for data
  let query = supabase
    .from("products")
    .select("id, name, price, image_url, category, sku, description, product_type, stock_quantity, company_name", {
      count: "exact",
    })

  if (search) {
    const searchTerm = search.trim()
    // format: column.operator.value, column.operator.value...
    // We want: name.ilike.%term%, company_name.ilike.%term%, description.ilike.%term%
    // Note: description might be too heavy for partial match on big table, but let's include it for completeness as requested.
    // Also including product_type.
    query = query.or(
      `name.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,product_type.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`,
    )
  }

  if (category && category !== "all") {
    const categoryMap: { [key: string]: string } = {
      automation: "Automation",
      "servo-motors": "Servo Motors",
      sensors: "Sensors",
      "drive-technology": "Drive Technology",
      pneumatics: "Pneumatics",
      "ball-bearing": "Ball-Bearing",
      pumps: "Pumps",
      valves: "Valves",
    }
    const productType = categoryMap[category.toLowerCase()]
    if (productType) {
      query = query.eq("product_type", productType)
    }
  }

  // Calculate range
  const pageSize = 48
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  console.log("--- DEBUG PRODUCT SERVER ---")
  console.log("Category:", category)
  console.log("Page:", page)
  console.log("Range:", from, to)

  const { data, count, error } = await query.range(from, to)

  console.log("Count:", count)
  console.log("Data length:", data?.length)
  console.log("Error:", error)
  console.log("----------------------------")

  const products = (data as unknown as Product[]) || []

  return (
    <ProductsContent
      initialProducts={products}
      totalProducts={count || 0}
      currentPage={page}
    />
  )
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ category?: string; page?: string; search?: string }>
}) {
  const searchParams = await props.searchParams
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProductsServer category={searchParams.category} page={page} search={searchParams.search} />
      </Suspense>
      <Footer />
    </>
  )
}

