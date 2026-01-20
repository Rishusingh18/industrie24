"use client"

import Link from "next/link"
import { ShoppingCart, Search, Menu, X, User, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

import { ManufacturerFilter } from "@/components/manufacturer-filter"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState("India (INR ₹)")
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const regions = [
    "India (INR ₹)",
    "Germany (EUR €)",
    "United States (USD $)",
    "United Kingdom (GBP £)",
    "Canada (CAD $)",
  ]

  const languages = ["English", "German", "French", "Spanish", "Hindi"]

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const { cart, wishlist, cartTotal } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* Top Bar */}
      <div className="bg-teal-600 text-white px-4 py-2 flex justify-end gap-6 text-sm">
        {/* Region Selector */}
        <div className="relative">
          <button
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            onClick={() => {
              setShowRegionDropdown(!showRegionDropdown)
              setShowLanguageDropdown(false)
            }}
          >
            {selectedRegion}
            <ChevronDown className={`h-4 w-4 transition-transform ${showRegionDropdown ? "rotate-180" : ""}`} />
          </button>
          {showRegionDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-48 z-10">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    setSelectedRegion(region)
                    setShowRegionDropdown(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${selectedRegion === region ? "bg-teal-100 font-semibold" : ""
                    }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            onClick={() => {
              setShowLanguageDropdown(!showLanguageDropdown)
              setShowRegionDropdown(false)
            }}
          >
            {selectedLanguage}
            <ChevronDown className={`h-4 w-4 transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`} />
          </button>
          {showLanguageDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-40 z-10">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => {
                    setSelectedLanguage(language)
                    setShowLanguageDropdown(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${selectedLanguage === language ? "bg-teal-100 font-semibold" : ""
                    }`}
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl font-bold">
              <span className="text-teal-600">INDUSTRIE</span>
              <span className="text-yellow-500">24</span>
              <span className="text-yellow-500">°</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="flex w-full items-center bg-gray-100 rounded px-4">
              <input type="text" placeholder="Search" className="flex-1 py-2 bg-gray-100 outline-none text-sm" />
              <Search className="h-5 w-5 text-gray-600" />
            </div>
          </div>

          {/* Contact & Support */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-lg">📞</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Contact & Support</div>
                <div className="text-sm font-semibold">+49 40 2285 1551</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* User Account */}
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              </Button>
            </Link>

            {/* Subtotal */}
            <div className="hidden md:block text-right">
              <div className="text-xs text-gray-600">Subtotal</div>
              <div className="text-sm font-semibold">${cartTotal.toFixed(2)}</div>
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between py-4">
            {/* Main Nav Items */}
            <nav className="flex items-center gap-8">
              <ManufacturerFilter
                trigger={
                  <button className="text-sm font-medium hover:text-teal-600 transition-colors">
                    Manufacturers
                  </button>
                }
              />

              {/* Products Dropdown */}
              <div className="relative group">
                <button
                  className="text-sm font-medium hover:text-teal-600 transition-colors flex items-center gap-1"
                  onClick={() => toggleDropdown("products")}
                >
                  Products
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block pt-2">
                  <div className="bg-white border rounded shadow-lg py-2 min-w-56">
                    <Link href="/products" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">
                      All Products
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

              <Link href="/request-spare-part" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Request a spare part
              </Link>

              <Link href="/industrial-purchase" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Industrial purchase
              </Link>

              {/* Company Details Dropdown */}
              <div className="relative group">
                <button
                  className="text-sm font-medium hover:text-teal-600 transition-colors flex items-center gap-1"
                  onClick={() => toggleDropdown("company")}
                >
                  Company Details
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block pt-2">
                  <div className="bg-white border rounded shadow-lg py-2 min-w-48">
                    <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      FAQ
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

            {/* Right Side Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-teal-600 transition-colors flex items-center gap-1"
              >
                📞 Contact
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium hover:text-teal-600 transition-colors flex items-center gap-1"
              >
                ❓ FAQ
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t space-y-4">
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
          )}
        </div>
      </div>

      {/* Shipping Banner */}
      <Link href="/shipment">
        <div className="bg-teal-600 text-white text-center py-2 hover:bg-teal-700 transition-colors cursor-pointer">
          <p className="text-sm font-medium">Free standard shipping in Germany from 100€ purchase value →</p>
        </div>
      </Link>
    </header>
  )
}
