"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AnalyticsData {
  totalPageViews: number
  totalEvents: number
  uniqueVisitors: number
  topProducts: Array<{ productId: string | number; views: number }>
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeframe, setTimeframe] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?timeframe=${timeframe}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = analytics?.topProducts || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-1">Track user behavior and website performance</p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "default" : "outline"}
              onClick={() => setTimeframe(period)}
              disabled={isLoading}
            >
              {period === "7d" ? "Last 7 Days" : period === "30d" ? "Last 30 Days" : "Last 90 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics?.totalPageViews || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Total page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics?.uniqueVisitors || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Distinct users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">User interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics?.topProducts.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Most viewed</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Viewed Products</CardTitle>
            <CardDescription>Most viewed products in selected timeframe</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="productId" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Bar dataKey="views" fill="var(--color-primary)" name="Views" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading analytics...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
