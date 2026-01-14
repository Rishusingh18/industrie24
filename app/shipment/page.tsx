import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Shipment - Industrie24",
  description: "Shipping methods, rates, and delivery information for Industrie24",
}

export default function ShipmentPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-teal-600">
              Home
            </a>
            <span>/</span>
            <span className="font-semibold text-gray-900">Shipment</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Shipment</h1>
            <p className="text-gray-600 mt-2">All shipping costs include VAT</p>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Germany Shipping */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Germany</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Standard (1-3 working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">4.99 €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Express (delivery by the end of the next business day*)
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">24 €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Express+ (delivery the next working day by 9 a.m.*)
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">99 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Pallet shipping (2-4 working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">190 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">*Standard running time</p>
          </div>

          {/* United States Shipping */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment United States</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Standard FedEx (4-6 Working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">59 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Express FedEx (2-4 Working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">119 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">*Standard running time</p>
          </div>

          {/* Canada Shipping */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment Canada</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Standard FedEx (4-5 Working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">49 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Express FedEx (2 Working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">119 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">*Standard running time</p>
          </div>

          {/* EU Countries */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment Belgium, Luxembourg, Netherlands</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Standard UPS (2-3 business days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">15 €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Express FedEx (next business day until 6 p.m.*)
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">59 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Express+ FedEx (next working day until 12 noon*)
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">99 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">*Standard running time</p>
          </div>

          {/* Austria, Denmark, France, Monaco */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment Austria, Denmark, France, Monaco</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Standard UPS (1-2 business days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">19 €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Express UPS (1-2 business days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">119 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Express+ FedEx (next working day until 12 noon*)
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">149 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">*Standard running time</p>
          </div>

          {/* Asia Shipping */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment India & Asia</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Standard UPS (3-4 Working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">49 €</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Express UPS (2 Working days*)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">99 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">*Standard running time</p>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 border-l-4 border-teal-600 p-6 rounded">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Information</h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>✓ All shipping costs include VAT</li>
              <li>✓ Free standard shipping in Germany from 100€ purchase value</li>
              <li>
                ✓ Customs clearance costs, taxes and customs duties will be charged separately by the transport company
              </li>
              <li>✓ You'll receive a tracking number via email once your order ships</li>
              <li>✓ We partner with FedEx, UPS, and other major carriers for reliable delivery</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
