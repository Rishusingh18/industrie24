import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: products, error } = await supabase.from("products").select("*").limit(5)

    if (error) throw error

    return NextResponse.json({
      success: true,
      count: products?.length || 0,
      sample: products,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
