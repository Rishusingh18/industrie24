import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { DashboardGalleries } from "@/components/account/dashboard-galleries"
import { ProfileForm } from "@/components/account/profile-form"

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[98%] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Account</h1>
            <SignOutButton />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Form */}
            <ProfileForm user={user} />

            {/* Dashboard Galleries */}
            <div className="md:col-span-2">
              <DashboardGalleries />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

