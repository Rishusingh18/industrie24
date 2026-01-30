import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Reviews - Unispare",
  description: "Customer reviews and testimonials for Unispare",
}

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      author: "John Mueller",
      company: "Industrial Solutions GmbH",
      rating: 5,
      title: "Excellent Service",
      content: "Outstanding quality products and very fast shipping. Highly recommended!",
      date: "2024-01-15",
    },
    {
      id: 2,
      author: "Maria Schmidt",
      company: "Manufacturing Works",
      rating: 5,
      title: "Reliable Partner",
      content: "We've been ordering from Unispare for 3 years. Always reliable and professional.",
      date: "2024-01-10",
    },
    {
      id: 3,
      author: "Hans Weber",
      company: "Engineering Plus",
      rating: 4,
      title: "Good Quality",
      content: "Good quality spare parts at competitive prices. Great customer support.",
      date: "2024-01-05",
    },
    {
      id: 4,
      author: "Anna Fischer",
      company: "Tech Industries",
      rating: 5,
      title: "Best in Class",
      content: "Best spare parts distributor I've worked with. Prompt delivery and excellent communication.",
      date: "2023-12-28",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600 mb-12">See what our customers say about Unispare</p>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                    <p className="text-sm text-gray-600">
                      {review.author} · {review.company}
                    </p>
                  </div>
                  <div className="text-yellow-500 text-sm">{"★".repeat(review.rating)}</div>
                </div>
                <p className="text-gray-700 mb-4">{review.content}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
