import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
      page_path: body.path,
      referrer: body.referrer,
      user_agent: request.headers.get("user-agent"),
      ip_address: request.headers.get("x-forwarded-for") || "0.0.0.0",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to track page view:", error)
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
