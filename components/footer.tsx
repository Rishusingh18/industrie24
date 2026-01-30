import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted py-12">
      <div className="mx-auto max-w-[98%] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Pumps" className="hover:text-foreground">
                  Pumps
                </Link>
              </li>
              <li>
                <Link href="/products?category=Motors" className="hover:text-foreground">
                  Motors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-foreground">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">© 2025 Unispare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
