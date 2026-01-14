import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { verifyAdminAccess } from "@/lib/admin/auth"
import { type NextRequest, NextResponse } from "next/server"

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

    const timeframe = request.nextUrl.searchParams.get("timeframe") || "7d"
    const startDate = new Date()

    if (timeframe === "7d") startDate.setDate(startDate.getDate() - 7)
    else if (timeframe === "30d") startDate.setDate(startDate.getDate() - 30)
    else if (timeframe === "90d") startDate.setDate(startDate.getDate() - 90)

    // Get page views
    const { data: pageViews } = await supabase.from("page_views").select("*").gte("created_at", startDate.toISOString())

    // Get analytics events
    const { data: events } = await supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDate.toISOString())

    // Get top products viewed
    const { data: topProducts } = await supabase
      .from("analytics_events")
      .select("product_id, event_type")
      .eq("event_type", "product_view")
      .gte("created_at", startDate.toISOString())

    // Count unique users
    const { data: uniqueUsers } = await supabase
      .from("page_views")
      .select("user_id")
      .gte("created_at", startDate.toISOString())
      .distinct()

    const analytics = {
      totalPageViews: pageViews?.length || 0,
      totalEvents: events?.length || 0,
      uniqueVisitors: new Set(uniqueUsers?.map((u) => u.user_id) || []).size,
      topProducts: topProducts
        ? Object.entries(
            topProducts.reduce((acc: Record<string, number>, e) => {
              if (e.product_id) {
                acc[e.product_id] = (acc[e.product_id] || 0) + 1
              }
              return acc
            }, {}),
          )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([id, count]) => ({ productId: id, views: count }))
        : [],
    }

    return NextResponse.json(analytics)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 })
  }
}
