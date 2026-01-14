"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, LogOut, ShoppingBag, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h1 className="text-4xl font-bold mb-6">Sign In</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Login to Your Account</CardTitle>
                    <CardDescription>Enter your email and password to continue</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => setIsLoggedIn(true)}>
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Create Account</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Join Industrie24 for exclusive benefits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsLoggedIn(true)}>
                      Create Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Account</h1>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle>John Doe</CardTitle>
                    <CardDescription>john@example.com</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+49 40 2285 1551</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">January 2024</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/cart">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-teal-600" />
                        <CardTitle className="text-lg">My Orders</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">View and manage your orders</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/wishlist">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-lg">Wishlist</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">View your saved items</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" defaultValue="John" className="w-full mt-2 px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" defaultValue="Doe" className="w-full mt-2 px-4 py-2 border rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full mt-2 px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+49 40 2285 1551"
                    className="w-full mt-2 px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
