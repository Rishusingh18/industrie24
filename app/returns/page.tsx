import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Returns Policy - Industrie24",
  description: "Returns and refund policy information",
}

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Returns & Refunds</h1>
          <p className="text-gray-600 mb-12">Our comprehensive returns and refund policy</p>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Period</h2>
              <p className="text-gray-600 mb-4">
                You have 30 days from the date of delivery to return unused items in their original condition with all
                packaging and documentation.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Return Items</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-600">
                <li>Contact our customer service team with your order number</li>
                <li>Receive a return authorization number (RMA)</li>
                <li>Pack items securely in original packaging</li>
                <li>Ship to our return address with the RMA number clearly marked</li>
                <li>We'll process your refund within 5-7 business days of receiving the return</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Shipping Costs</h2>
              <p className="text-gray-600">
                Return shipping costs are covered by Industrie24 for returns due to defective or damaged items. For
                other returns, customers are responsible for return shipping costs.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Non-Returnable Items</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Custom or made-to-order items</li>
                <li>Items showing signs of use or damage</li>
                <li>Items without original packaging</li>
                <li>Clearance or final sale items</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
