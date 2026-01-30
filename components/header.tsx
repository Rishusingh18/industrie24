"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, Menu, X, User, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCurrency, type Currency } from "@/lib/currency-context"
import { useLanguage, type Language } from "@/lib/language-context"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

import { ManufacturerFilter } from "@/components/manufacturer-filter"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const { currency, setCurrency, formatPrice } = useCurrency()
  const { language, setLanguage, t } = useLanguage()

  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const regions: { name: string; value: Currency }[] = [
    { name: "India (INR ₹)", value: "INR" },
    { name: "Germany (EUR €)", value: "EUR" },
    { name: "United States (USD $)", value: "USD" },
    { name: "United Kingdom (GBP £)", value: "GBP" },
    { name: "Canada (CAD $)", value: "CAD" },
  ]

  const languages: { name: string; value: Language }[] = [
    { name: "English", value: "en" },
    { name: "German", value: "de" },
    { name: "French", value: "fr" },
    { name: "Spanish", value: "es" },
    { name: "Hindi", value: "hi" },
  ]

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const { cart, wishlist, cartTotal } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* Top Bar */}
      <div className="bg-teal-600 text-white px-4 py-1 flex justify-end gap-6 text-sm">
        {/* Region Selector */}
        <div className="relative">
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer select-none"
            onClick={() => {
              setShowRegionDropdown(!showRegionDropdown)
              setShowLanguageDropdown(false)
            }}
            suppressHydrationWarning
          >
            {regions.find((r) => r.value === currency)?.name}
            <ChevronDown className={`h-4 w-4 transition-transform ${showRegionDropdown ? "rotate-180" : ""}`} />
          </div>
          {showRegionDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-48 z-10">
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() => {
                    setCurrency(region.value)
                    setShowRegionDropdown(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${currency === region.value ? "bg-teal-100 font-semibold" : ""
                    }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer select-none"
            onClick={() => {
              setShowLanguageDropdown(!showLanguageDropdown)
              setShowRegionDropdown(false)
            }}
            suppressHydrationWarning
          >
            {languages.find((l) => l.value === language)?.name}
            <ChevronDown className={`h-4 w-4 transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`} />
          </div>
          {showLanguageDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-40 z-10">
              {languages.map((l) => (
                <button
                  key={l.value}
                  onClick={() => {
                    setLanguage(l.value)
                    setShowLanguageDropdown(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${language === l.value ? "bg-teal-100 font-semibold" : ""
                    }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      {/* Main Header */}
      <div className="w-full px-4 py-0 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/file.svg"
              alt="Unispare Logo"
              width={1024}
              height={524}
              className="h-20 w-auto scale-150 origin-left -ml-8"
              priority
            />
          </Link>


          {/* Main Nav Items */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-12 mr-8">
            <ManufacturerFilter
              trigger={
                <div role="button" tabIndex={0} className="text-base font-medium hover:text-teal-600 transition-colors cursor-pointer select-none" suppressHydrationWarning>
                  {t("nav.manufacturers")}
                </div>
              }
            />

            {/* Products Dropdown */}
            <div className="relative group">
              <div
                role="button"
                tabIndex={0}
                className="text-base font-medium hover:text-teal-600 transition-colors flex items-center gap-1 cursor-pointer select-none"
                onClick={() => toggleDropdown("products")}
                suppressHydrationWarning
              >
                {t("nav.products")}
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="absolute left-0 top-full hidden group-hover:block pt-2">
                <div className="bg-white border rounded shadow-lg py-2 min-w-56">
                  <Link href="/products" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
                    {t("products.view_all")}
                  </Link>
                  <div className="border-t my-2"></div>
                  <Link href="/products?category=automation" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Automation
                  </Link>
                  <Link href="/products?category=servo-motors" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Servo Motors
                  </Link>
                  <Link href="/products?category=sensors" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Sensors
                  </Link>
                  <Link
                    href="/products?category=drive-technology"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Drive Technology
                  </Link>
                  <Link href="/products?category=pneumatics" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Pneumatics
                  </Link>
                  <Link href="/products?category=ball-bearing" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Ball-Bearing
                  </Link>
                  <Link href="/products?category=pumps" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Pumps
                  </Link>
                  <Link href="/products?category=valves" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Valves
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/request-spare-part" className="text-base font-medium hover:text-teal-600 transition-colors">
              {t("nav.request_part")}
            </Link>

            <Link href="/industrial-purchase" className="text-base font-medium hover:text-teal-600 transition-colors">
              {t("nav.industrial_purchase")}
            </Link>

            {/* Company Details Dropdown */}
            <div className="relative group">
              <div
                role="button"
                tabIndex={0}
                className="text-base font-medium hover:text-teal-600 transition-colors flex items-center gap-1 cursor-pointer select-none"
                onClick={() => toggleDropdown("company")}
                suppressHydrationWarning
              >
                {t("nav.company_details")}
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="absolute left-0 top-full hidden group-hover:block pt-2">
                <div className="bg-white border rounded shadow-lg py-2 min-w-48">
                  <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    {t("nav.faq")}
                  </Link>
                  <Link href="/reviews" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Reviews
                  </Link>
                  <Link href="/payment" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Payment
                  </Link>
                  <Link href="/returns" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Returns
                  </Link>
                  <Link href="/shipment" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Shipment
                  </Link>
                  <Link href="/conditions" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Conditions
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-2 md:gap-4">
            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex justify-end">
              <div className="flex items-center bg-gray-100 hover:bg-white focus-within:bg-white rounded-full px-4 border border-transparent hover:border-teal-200 focus-within:border-teal-500 focus-within:shadow-md transition-all duration-300 w-[360px] h-10 group">
                <Search className="h-5 w-5 text-gray-600 group-focus-within:text-teal-600 transition-colors flex-shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder={t("header.search")}
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-500 w-full"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Mobile Search Icon */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/products">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {/* Contact & FAQ */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/contact"
                className="text-base font-medium hover:text-teal-600 transition-colors flex items-center gap-1"
              >
                📞 {t("nav.contact")}
              </Link>
              <Link
                href="/faq"
                className="text-base font-medium hover:text-teal-600 transition-colors flex items-center gap-1"
              >
                ❓ {t("nav.faq")}
              </Link>
            </div>
            {/* User Account */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              </Link>
            </Button>

            {/* Subtotal */}
            <div className="hidden md:block text-right">
              <div className="text-sm text-gray-600">{t("header.subtotal")}</div>
              <div className="text-base font-semibold" suppressHydrationWarning>{formatPrice(cartTotal)}</div>
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 pb-4 pt-2 space-y-4">
            <ManufacturerFilter
              trigger={
                <button className="block text-sm font-medium py-2 w-full text-left">
                  Manufacturers
                </button>
              }
            />
            <button
              onClick={() => toggleDropdown("products")}
              className="w-full text-left text-sm font-medium py-2 flex justify-between items-center"
            >
              Products
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openDropdown === "products" ? "rotate-180" : ""}`}
              />
            </button>
            {openDropdown === "products" && (
              <div className="ml-4 space-y-2">
                <Link href="/products" className="block text-sm font-semibold py-1">
                  All Products
                </Link>
                <Link href="/products?category=automation" className="block text-sm py-1">
                  Automation
                </Link>
                <Link href="/products?category=servo-motors" className="block text-sm py-1">
                  Servo Motors
                </Link>
                <Link href="/products?category=sensors" className="block text-sm py-1">
                  Sensors
                </Link>
                <Link href="/products?category=drive-technology" className="block text-sm py-1">
                  Drive Technology
                </Link>
                <Link href="/products?category=pneumatics" className="block text-sm py-1">
                  Pneumatics
                </Link>
                <Link href="/products?category=ball-bearing" className="block text-sm py-1">
                  Ball-Bearing
                </Link>
                <Link href="/products?category=pumps" className="block text-sm py-1">
                  Pumps
                </Link>
                <Link href="/products?category=valves" className="block text-sm py-1">
                  Valves
                </Link>
              </div>
            )}
            <Link href="/request-spare-part" className="block text-sm font-medium py-2">
              Request a spare part
            </Link>
            <Link href="/industrial-purchase" className="block text-sm font-medium py-2">
              Industrial purchase
            </Link>
            <button
              onClick={() => toggleDropdown("company")}
              className="w-full text-left text-sm font-medium py-2 flex justify-between items-center"
            >
              Company Details
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openDropdown === "company" ? "rotate-180" : ""}`}
              />
            </button>
            {openDropdown === "company" && (
              <div className="ml-4 space-y-2">
                <Link href="/faq" className="block text-sm py-1">
                  FAQ
                </Link>
                <Link href="/reviews" className="block text-sm py-1">
                  Reviews
                </Link>
                <Link href="/payment" className="block text-sm py-1">
                  Payment
                </Link>
                <Link href="/returns" className="block text-sm py-1">
                  Returns
                </Link>
                <Link href="/shipment" className="block text-sm py-1">
                  Shipment
                </Link>
                <Link href="/conditions" className="block text-sm py-1">
                  Conditions
                </Link>
              </div>
            )}
            <Link href="/contact" className="block text-sm font-medium py-2">
              Contact
            </Link>
            <Link href="/faq" className="block text-sm font-medium py-2">
              FAQ
            </Link>
          </nav>
        </div>
      )}

      <Link href="/shipment" className="block">
        <div className="bg-teal-600 text-white text-center py-1 hover:bg-teal-700 transition-colors cursor-pointer">
          <p className="text-sm font-medium">{t("banner.shipping")}</p>
        </div>
      </Link>
    </header>
  )
}
