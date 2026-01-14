import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's an admin route
  if (pathname.startsWith("/admin")) {
    try {
      const cookieStore = request.cookies
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              const response = NextResponse.next()
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options)
              })
              return response
            },
          },
        },
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Check if user is an admin
      const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

      if (!adminUser || !adminUser.is_active) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
