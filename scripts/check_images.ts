import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkImages() {
    const { data: products } = await supabase.from("products").select("id, name").limit(1)
    if (!products || products.length === 0) {
        console.log("No products found")
        return
    }
    const pid = products[0].id
    console.log(`Checking images for product ${pid} (${products[0].name})`)

    const { count, error } = await supabase.from("product_images").select("*", { count: "exact", head: true }).eq("product_id", pid)

    if (error) console.error("Error:", error)
    console.log("Image count:", count)
}

checkImages()
