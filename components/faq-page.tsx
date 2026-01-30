"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

const faqs = [
  {
    id: "faq-1",
    category: "Ordering",
    question: "How do I place an order?",
    answer:
      "You can place an order by browsing our product catalog, adding items to your cart, and proceeding to checkout. You'll need to provide shipping and payment information. We accept all major credit cards and process payments securely through Stripe.",
  },
  {
    id: "faq-2",
    category: "Ordering",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. All payments are processed securely using industry-standard encryption.",
  },
  {
    id: "faq-3",
    category: "Ordering",
    question: "Can I place a bulk order?",
    answer:
      "Yes! We offer special pricing for bulk orders. Please contact our sales team directly at sales@unispare.com or call +1 (555) 123-4567 for a custom quote.",
  },
  {
    id: "faq-4",
    category: "Shipping",
    question: "How long does shipping take?",
    answer:
      "Standard domestic shipping typically takes 3-5 business days. International orders may take 7-14 business days depending on the destination. Expedited shipping options are available at checkout.",
  },
  {
    id: "faq-5",
    category: "Shipping",
    question: "Is shipping free?",
    answer:
      "We offer free shipping on orders over $100 within the United States. For international orders and orders under $100, shipping costs will be calculated at checkout.",
  },
  {
    id: "faq-6",
    category: "Shipping",
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping costs vary based on destination and weight. You can view shipping costs for your location during checkout.",
  },
  {
    id: "faq-7",
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day money-back guarantee on all products. If you're not satisfied with your purchase, contact our customer service team to initiate a return within 30 days of purchase.",
  },
  {
    id: "faq-8",
    category: "Returns",
    question: "How do I return an item?",
    answer:
      "To return an item, contact our customer service team with your order number. We'll provide you with a return shipping label and instructions. Once we receive and inspect the item, we'll process your refund.",
  },
  {
    id: "faq-9",
    category: "Returns",
    question: "What is the refund timeline?",
    answer:
      "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.",
  },
  {
    id: "faq-10",
    category: "Products",
    question: "Are your products genuine?",
    answer:
      "Yes, all products sold on Unispare are 100% genuine and sourced directly from manufacturers or authorized distributors. We stand behind the quality and authenticity of every item.",
  },
  {
    id: "faq-11",
    category: "Products",
    question: "Do products come with warranties?",
    answer:
      "Most products come with a 12-month manufacturer warranty. Extended warranties may be available for certain items. Check the product details page for warranty information specific to your item.",
  },
  {
    id: "faq-12",
    category: "Products",
    question: "Can I get technical specifications for a product?",
    answer:
      "Yes, detailed technical specifications are available on each product's detail page. If you need additional information, you can contact our technical support team.",
  },
  {
    id: "faq-13",
    category: "Account",
    question: "Do I need an account to purchase?",
    answer:
      "You can checkout as a guest without creating an account. However, creating an account allows you to track orders, save addresses, and access exclusive deals.",
  },
  {
    id: "faq-14",
    category: "Account",
    question: "How do I reset my password?",
    answer:
      "Click on the 'Forgot Password' link on the login page. Enter your email address and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
  },
  {
    id: "faq-15",
    category: "Account",
    question: "How do I update my account information?",
    answer:
      "Log in to your account and click on 'Account Settings'. From there, you can update your email, password, shipping addresses, and billing information.",
  },
]

const categories = Array.from(new Set(faqs.map((faq) => faq.category)))

export function FAQPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-[98%] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about ordering, shipping, returns, and more.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary">{category}</h2>
            <Card className="border-none shadow-none">
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs
                    .filter((faq) => faq.category === category)
                    .map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
                        <AccordionTrigger className="hover:text-primary hover:no-underline py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* CTA Section */}
        <div className="mt-16 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold mb-4">Didn't find your answer?</h2>
          <p className="mb-6 opacity-90">Get in touch with our support team. We're here to help!</p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary px-6 py-2 rounded font-medium hover:bg-gray-100"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  )
}
