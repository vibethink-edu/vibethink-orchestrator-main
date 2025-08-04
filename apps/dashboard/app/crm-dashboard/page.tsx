'use client'

import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout'
import { CrmHeader } from './components/CrmHeader'
import { CrmMetrics } from './components/CrmMetrics'
import { CustomerTable } from './components/CustomerTable'
import { DealsTable } from './components/DealsTable'
import { CrmCharts } from './components/CrmCharts'
import { QuickActions } from './components/QuickActions'

export default function CrmDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <CrmHeader />
        
        <div className="grid gap-6">
          <CrmMetrics />
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CustomerTable />
              <DealsTable />
            </div>
            
            <div className="space-y-6">
              <QuickActions />
              <CrmCharts />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}