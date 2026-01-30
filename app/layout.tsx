import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { CurrencyProvider } from "@/lib/currency-context"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Unispare - Industrial Spare Parts & Components",
  description: "Your trusted source for high-quality industrial spare parts, bearings, pumps, motors and more",
  icons: {
    icon: "/favicon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <CurrencyProvider>
            <CartProvider>
              {children}
              <Analytics />
              <Toaster />
            </CartProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
