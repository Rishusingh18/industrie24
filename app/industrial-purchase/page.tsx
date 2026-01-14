import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Industrial Purchase - Industrie24",
  description: "Bulk and wholesale purchasing solutions for industrial companies",
}

export default function IndustrialPurchasePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Industrial Purchase Program</h1>
          <p className="text-gray-600 mb-12">Special rates and solutions for bulk industrial purchases</p>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Benefits of Our B2B Program</h2>
              <ul className="space-y-3">
                {[
                  "Bulk purchase discounts (5-15% savings)",
                  "Dedicated account manager for your company",
                  "Flexible payment terms and invoicing",
                  "Priority customer support",
                  "Custom product specifications available",
                  "Fast turnaround times for large orders",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-teal-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Submit Quote Request",
                    desc: "Provide details of your bulk purchase requirements",
                  },
                  {
                    step: 2,
                    title: "Get Custom Quote",
                    desc: "Our team prepares a personalized offer with volume discounts",
                  },
                  {
                    step: 3,
                    title: "Negotiate Terms",
                    desc: "Discuss payment terms, delivery schedules, and specifications",
                  },
                  { step: 4, title: "Place Order", desc: "Finalize the order with your dedicated account manager" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg border border-teal-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-700 mb-6">
                Contact our B2B team to discuss your industrial purchasing needs and receive a custom quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition-colors">
                  Request Quote
                </button>
                <button className="border-2 border-teal-600 text-teal-600 px-6 py-2 rounded hover:bg-teal-50 transition-colors">
                  Contact Sales Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
