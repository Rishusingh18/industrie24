import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Request a Spare Part - Unispare",
  description: "Request spare parts that are not listed in our catalog",
}

export default function RequestSparePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Request a Spare Part</h1>
          <p className="text-gray-600 mb-12">
            Don't find the spare part you need? Submit a request and our team will help you locate it.
          </p>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Enter product name or model number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Enter manufacturer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model/Serial Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Enter model or serial number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Describe the spare part you're looking for"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="+49 40 XXXX XXXX"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
