"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "de" | "fr" | "es" | "hi"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const TRANSLATIONS: Record<Language, Record<string, string>> = {
    en: {
        "nav.manufacturers": "Manufacturers",
        "nav.products": "Products",
        "nav.request_part": "Request a spare part",
        "nav.industrial_purchase": "Industrial purchase",
        "nav.company_details": "Company Details",
        "nav.contact": "Contact",
        "nav.faq": "FAQ",
        "header.search": "Search",
        "header.contact_support": "Contact & Support",
        "header.subtotal": "Subtotal",
        "featured.title": "Featured Products",
        "featured.subtitle": "Explore our most popular industrial components and spare parts",
        "products.view_details": "View Details",
        "products.add_to_cart": "Add to Cart",
        "products.added": "Added",
        "products.in_stock": "In Stock",
        "products.out_of_stock": "Out of Stock",
        "products.view_all": "View All Products",
        "filters.search_placeholder": "Search products by name, type, or description...",
        "filters.active_filters": "Active filters:",
        "filters.clear_all": "Clear all",
        "filters.showing_results": "Showing results",
        "filters.no_results": "No products found",
        "banner.shipping": "Free standard shipping in Germany from 100€ purchase value →"
    },
    de: {
        "nav.manufacturers": "Hersteller",
        "nav.products": "Produkte",
        "nav.request_part": "Ersatzteil anfragen",
        "nav.industrial_purchase": "Industrieller Einkauf",
        "nav.company_details": "Unternehmensdetails",
        "nav.contact": "Kontakt",
        "nav.faq": "FAQ",
        "header.search": "Suche",
        "header.contact_support": "Kontakt & Support",
        "header.subtotal": "Zwischensumme",
        "featured.title": "Highlight-Produkte",
        "featured.subtitle": "Entdecken Sie unsere beliebtesten Industriekomponenten",
        "products.view_details": "Details anzeigen",
        "products.add_to_cart": "In den Warenkorb",
        "products.added": "Hinzugefügt",
        "products.in_stock": "Auf Lager",
        "products.out_of_stock": "Ausverkauft",
        "products.view_all": "Alle Produkte ansehen",
        "filters.search_placeholder": "Suche nach Name, Typ oder Beschreibung...",
        "filters.active_filters": "Aktive Filter:",
        "filters.clear_all": "Alles löschen",
        "filters.showing_results": "Zeige Ergebnisse",
        "filters.no_results": "Keine Produkte gefunden",
        "banner.shipping": "Kostenloser Standardversand in Deutschland ab 100€ Bestellwert →"
    },
    fr: {
        "nav.manufacturers": "Fabricants",
        "nav.products": "Produits",
        "nav.request_part": "Demander une pièce",
        "nav.industrial_purchase": "Achat industriel",
        "nav.company_details": "Détails de l'entreprise",
        "nav.contact": "Contact",
        "nav.faq": "FAQ",
        "header.search": "Rechercher",
        "header.contact_support": "Contact & Support",
        "header.subtotal": "Sous-total",
        "featured.title": "Produits en vedette",
        "featured.subtitle": "Découvrez nos composants industriels les plus populaires",
        "products.view_details": "Voir les détails",
        "products.add_to_cart": "Ajouter au panier",
        "products.added": "Ajouté",
        "products.in_stock": "En stock",
        "products.out_of_stock": "Épuisé",
        "products.view_all": "Voir tous les produits",
        "filters.search_placeholder": "Rechercher par nom, type ou description...",
        "filters.active_filters": "Filtres actifs:",
        "filters.clear_all": "Tout effacer",
        "filters.showing_results": "Affichage des résultats",
        "filters.no_results": "Aucun produit trouvé",
        "banner.shipping": "Livraison standard gratuite en Allemagne dès 100€ d'achat →"
    },
    es: {
        "nav.manufacturers": "Fabricantes",
        "nav.products": "Productos",
        "nav.request_part": "Solicitar pieza",
        "nav.industrial_purchase": "Compra industrial",
        "nav.company_details": "Detalles de la empresa",
        "nav.contact": "Contacto",
        "nav.faq": "FAQ",
        "header.search": "Buscar",
        "header.contact_support": "Contacto y soporte",
        "header.subtotal": "Subtotal",
        "featured.title": "Productos destacados",
        "featured.subtitle": "Explore nuestros componentes industriales más populares",
        "products.view_details": "Ver detalles",
        "products.add_to_cart": "Añadir al carrito",
        "products.added": "Añadido",
        "products.in_stock": "En stock",
        "products.out_of_stock": "Agotado",
        "products.view_all": "Ver todos los productos",
        "filters.search_placeholder": "Buscar por nombre, tipo o descripción...",
        "filters.active_filters": "Filtros activos:",
        "filters.clear_all": "Borrar todo",
        "filters.showing_results": "Mostrando resultados",
        "filters.no_results": "No se encontraron productos",
        "banner.shipping": "Envío estándar gratuito en Alemania a partir de 100€ →"
    },
    hi: {
        "nav.manufacturers": "निर्माता",
        "nav.products": "उत्पाद",
        "nav.request_part": "स्पेयर पार्ट का अनुरोध करें",
        "nav.industrial_purchase": "औद्योगिक खरीद",
        "nav.company_details": "कंपनी विवरण",
        "nav.contact": "संपर्क करें",
        "nav.faq": "सामान्य प्रश्न",
        "header.search": "खोजें",
        "header.contact_support": "संपर्क और सहायता",
        "header.subtotal": "उपयोग",
        "featured.title": "विशेष उत्पाद",
        "featured.subtitle": "हमारे सबसे लोकप्रिय औद्योगिक घटकों का अन्वेषण करें",
        "products.view_details": "विवरण देखें",
        "products.add_to_cart": "कार्ट में जोड़ें",
        "products.added": "जोड़ा गया",
        "products.in_stock": "स्टॉक में",
        "products.out_of_stock": "स्टॉक खत्म",
        "products.view_all": "सभी उत्पाद देखें",
        "filters.search_placeholder": "नाम, प्रकार या विवरण द्वारा उत्पाद खोजें...",
        "filters.active_filters": "सक्रिय फिल्टर:",
        "filters.clear_all": "सभी साफ़ करें",
        "filters.showing_results": "परिणाम दिखा रहा है",
        "filters.no_results": "कोई उत्पाद नहीं मिला",
        "banner.shipping": "जर्मनी में 100€ से अधिक की खरीद पर मुफ्त मानक शिपिंग →"
    }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en")

    useEffect(() => {
        const saved = localStorage.getItem("preferred_language")
        if (saved && (saved in TRANSLATIONS)) {
            setLanguage(saved as Language)
        }
    }, [])

    const updateLanguage = (l: Language) => {
        setLanguage(l)
        localStorage.setItem("preferred_language", l)
    }

    const t = (key: string) => {
        return TRANSLATIONS[language][key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
