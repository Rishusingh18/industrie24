import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function trackEvent(
  eventType: string,
  eventData: Record<string, unknown>,
  userId?: string,
  productId?: number,
) {
  try {
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

    await supabase.from("analytics_events").insert({
      event_type: eventType,
      user_id: userId,
      product_id: productId,
      event_data: eventData,
    })
  } catch (error) {
    console.error("Failed to track event:", error)
  }
}

export async function trackPageView(pagePath: string, referrer?: string, userId?: string) {
  try {
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

    await supabase.from("page_views").insert({
      page_path: pagePath,
      referrer: referrer,
      user_id: userId,
    })
  } catch (error) {
    console.error("Failed to track page view:", error)
  }
}
