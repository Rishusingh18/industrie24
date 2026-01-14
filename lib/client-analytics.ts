export function trackPageView() {
  if (typeof window === "undefined") return

  const pageData = {
    path: window.location.pathname,
    referrer: document.referrer,
    title: document.title,
  }

  // Send to analytics endpoint (client-side)
  navigator.sendBeacon("/api/analytics/page-view", JSON.stringify(pageData))
}

export function trackProductView(productId: number) {
  if (typeof window === "undefined") return

  navigator.sendBeacon("/api/analytics/product-view", JSON.stringify({ productId }))
}
