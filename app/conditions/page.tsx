import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms & Conditions - Unispare",
  description: "Terms and conditions of use for Industrie24",
}

export default function ConditionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-600 mb-12">Last updated: January 2024</p>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. General</h2>
              <p className="text-gray-600">
                These terms and conditions govern your use of the Unispare website and all related services. By
                accessing this website, you accept these terms and conditions in their entirety.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                Unispare for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Disclaimer</h2>
              <p className="text-gray-600">
                The materials on Unispare are provided on an "as is" basis. Unispare makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Limitations</h2>
              <p className="text-gray-600">
                In no event shall Unispare or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on Unispare.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Product Information</h2>
              <p className="text-gray-600">
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product
                descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. If a
                product offered by Unispare is not as described, your only remedy is to return it in unused
                condition.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Governing Law</h2>
              <p className="text-gray-600">
                These terms and conditions are governed by and construed in accordance with the laws of Germany, and you
                irrevocably submit to the exclusive jurisdiction of the courts located there.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
