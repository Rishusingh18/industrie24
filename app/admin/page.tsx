import { verifyAdminAccess } from "@/lib/admin/auth"
import { Redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductManagementPanel } from "@/components/admin/product-management-panel"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export default async function AdminDashboard() {
  try {
    await verifyAdminAccess()
  } catch {
    return <Redirect to="/admin/login" />
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AnalyticsDashboard />
        <ProductManagementPanel />
      </div>
    </AdminLayout>
  )
}
