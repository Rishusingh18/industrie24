import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Manufacturers - Unispare",
  description: "Browse industrial equipment manufacturers and suppliers",
}

export default function ManufacturersPage() {
  const manufacturers = [
    { id: 1, name: "Siemens", logo: "S" },
    { id: 2, name: "B&R Automation", logo: "BR" },
    { id: 3, name: "Festo", logo: "F" },
    { id: 4, name: "Pepperl+Fuchs", logo: "PF" },
    { id: 5, name: "ABB", logo: "ABB" },
    { id: 6, name: "Danfoss", logo: "D" },
    { id: 7, name: "Sick", logo: "S" },
    { id: 8, name: "Bosch Rexroth", logo: "BR" },
    { id: 9, name: "Wago", logo: "W" },
    { id: 10, name: "Schneider Electric", logo: "SE" },
    { id: 11, name: "Allen-Bradley", logo: "AB" },
    { id: 12, name: "Phoenix Contact", logo: "PC" },
    { id: 13, name: "Lenze", logo: "L" },
    { id: 14, name: "Wieland", logo: "WI" },
    { id: 15, name: "Leuze", logo: "LZ" },
    { id: 16, name: "Murr", logo: "M" },
    { id: 17, name: "Turck", logo: "T" },
    { id: 18, name: "Eaton", logo: "E" },
    { id: 19, name: "Pilz", logo: "P" },
    { id: 20, name: "Moeller", logo: "MO" },
    { id: 21, name: "Anderson-Negele", logo: "AN" },
    { id: 22, name: "INA", logo: "INA" },
    { id: 23, name: "Telemecanique", logo: "TM" },
    { id: 24, name: "Norgren", logo: "N" },
    { id: 25, name: "SKF", logo: "SKF" },
    { id: 26, name: "FAG", logo: "FAG" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manufacturers</h1>
          <p className="text-gray-600 mb-12">Browse products from leading industrial manufacturers</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {manufacturers.map((manufacturer) => (
              <Link
                key={manufacturer.id}
                href={`/products?manufacturer=${manufacturer.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                  {/* Manufacturer logo placeholder */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                    <span className="text-sm font-bold text-gray-600">{manufacturer.logo}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                    {manufacturer.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
