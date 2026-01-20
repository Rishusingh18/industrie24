import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if it's an admin route
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!user) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Check if user is an admin
      const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

      if (!adminUser || !adminUser.is_active) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    // If error on admin route, redirect to login
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
