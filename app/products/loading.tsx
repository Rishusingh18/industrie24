export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="space-y-4">
            <div className="h-10 w-full bg-muted rounded"></div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg overflow-hidden space-y-4 p-4">
                <div className="aspect-square bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
