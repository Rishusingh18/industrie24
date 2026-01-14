import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { verifyAdminAccess } from "@/lib/admin/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Handle error
            }
          },
        },
      },
    )

    const body = await request.json()
    const { name, company_name, product_type, model, price, image_url, description, category, stock_quantity, sku } =
      body

    if (!name || !company_name || !product_type || !model || !price || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        company_name,
        product_type,
        model,
        price: Number.parseFloat(price),
        image_url,
        description,
        category,
        stock_quantity: Number.parseInt(stock_quantity) || 0,
        sku: sku || `SKU-${Date.now()}`,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Handle error
            }
          },
        },
      },
    )

    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 })
  }
}
