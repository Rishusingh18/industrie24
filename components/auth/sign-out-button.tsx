"use client"

import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function SignOutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { error } = await supabase.auth.signOut()
            if (error) {
                throw error
            }

            router.refresh()
            router.push("/login")
            toast.success("Signed out successfully")
        } catch (error) {
            console.error("Error signing out:", error)
            toast.error("Error signing out")
        }
    }

    return (
        <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Sign Out
        </Button>
    )
}
