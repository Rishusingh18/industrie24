import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Payment Methods - Industrie24",
  description: "Payment methods and secure payment information",
}

export default function PaymentPage() {
  const paymentMethods = [
    {
      id: 1,
      name: "Credit Card",
      description: "Visa, Mastercard, American Express",
      icon: "💳",
    },
    {
      id: 2,
      name: "Bank Transfer",
      description: "Direct bank transfer to our account",
      icon: "🏦",
    },
    {
      id: 3,
      name: "PayPal",
      description: "Secure payment via PayPal",
      icon: "📱",
    },
    {
      id: 4,
      name: "Invoice",
      description: "Payment on invoice (for registered businesses)",
      icon: "📄",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Methods</h1>
          <p className="text-gray-600 mb-12">We offer multiple secure payment options for your convenience</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.name}</h3>
                <p className="text-gray-600">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">SSL Encryption</h3>
                <p className="text-gray-600">
                  All payments are processed through secure SSL encrypted connections to protect your sensitive
                  information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">PCI Compliance</h3>
                <p className="text-gray-600">
                  We comply with PCI DSS standards to ensure your payment data is handled securely.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                <p className="text-gray-600">
                  Your personal and payment information is never shared with third parties without your consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
