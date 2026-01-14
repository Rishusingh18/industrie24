"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage products and view analytics</p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline">Back to Store</Button>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <Button variant="destructive">Logout</Button>
              </form>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </div>
      <Footer />
    </>
  )
}
