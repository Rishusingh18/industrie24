import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl xl:text-6xl">
              Industrial Spare Parts & Components
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Your trusted partner for high-quality industrial spare parts, bearings, pumps, motors, and components.
              With over 20 years of industry expertise, we deliver reliability and excellence.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 overflow-hidden">
              <img
                src="/industrial-parts-warehouse.jpg"
                alt="Industrial parts warehouse"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
