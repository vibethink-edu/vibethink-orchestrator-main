/**
 * EcommerceDashboard - Dashboard original de Shadcn UI Kit
 * 
 * Versión completa del paquete original con todos los componentes
 * y estilos predefinidos funcionando correctamente.
 */

import React from 'react';
import { Download } from 'lucide-react';
import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';

// UI Components
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';

// Theme Customizer
import { ThemeCustomizerPanel } from '@/shared/components/bundui-premium/components/theme-customizer';

// Date Range Picker
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/bundui-premium/components/ui/select';

// Componentes originales del E-commerce Dashboard
const EcommerceWelcomeCard: React.FC = () => {
  return (
    <Card className="bg-muted relative overflow-hidden md:col-span-6 xl:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl">Congratulations Toby! 🎉</CardTitle>
        <CardDescription>Best seller of the month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-3xl">$15,231.89</div>
            <div className="text-muted-foreground text-xs">
              <span className="text-green-500">+65%</span> from last month
            </div>
          </div>
          <Button variant="outline">View Sales</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceRevenueCard: React.FC = () => {
  return (
    <Card className="md:col-span-6 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue</CardTitle>
        <CardDescription className="text-xs">
          <span className="text-green-500">+20.1%</span> from last month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl">$125,231</div>
        <div className="pt-4">
          <div className="h-[60px] w-full bg-muted rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chart placeholder</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceSalesCard: React.FC = () => {
  return (
    <Card className="md:col-span-6 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales</CardTitle>
        <CardDescription className="text-xs">
          <span className="text-red-500">-2.7%</span> from last month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl">20K</div>
        <div className="pt-4">
          <div className="h-[60px] w-full bg-muted rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chart placeholder</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceNewCustomersCard: React.FC = () => {
  return (
    <Card className="md:col-span-6 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New Customers</CardTitle>
        <CardDescription className="text-xs">
          <span className="text-green-500">+18.1%</span> from last month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl">3602</div>
        <div className="pt-4">
          <div className="h-[60px] w-full bg-muted rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chart placeholder</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceTotalRevenueCard: React.FC = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>Income in the last 28 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Desktop</span>
            <span className="font-mono text-sm">24,828</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Mobile</span>
            <span className="font-mono text-sm">25,010</span>
          </div>
          <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Bar Chart placeholder</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceReturnRateCard: React.FC = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Return Rate</CardTitle>
        <CardDescription>Return rate in the last 28 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="font-display text-4xl">$42,379</div>
            <div className="text-sm text-muted-foreground">+2.5%</div>
          </div>
          <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Line Chart placeholder</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceSalesByLocationCard: React.FC = () => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Sales by Location</CardTitle>
        <CardDescription>Income in the last 28 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Canada</span>
            <span className="text-sm">85%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Greenland</span>
            <span className="text-sm">80%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Russia</span>
            <span className="text-sm">53%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">China</span>
            <span className="text-sm">50%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceVisitBySourceCard: React.FC = () => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Store Visits by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <div className="font-display text-4xl">10.2K</div>
            <div className="text-sm text-muted-foreground">Pie Chart placeholder</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceCustomerReviewsCard: React.FC = () => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>Based on 3,069 verified purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">⭐⭐⭐⭐⭐</span>
            <span className="text-sm">4000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">⭐⭐⭐⭐</span>
            <span className="text-sm">2100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">⭐⭐⭐</span>
            <span className="text-sm">800</span>
          </div>
          <div className="text-sm text-muted-foreground mt-4">
            "Exceeded my expectations!"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceRecentOrdersCard: React.FC = () => {
  return (
    <Card className="xl:col-span-8">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <span className="font-medium">#9021</span>
              <div className="text-sm text-muted-foreground">Theodore Bell - Pro Standard</div>
            </div>
            <span className="text-sm">$300.60</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <span className="font-medium">#9020</span>
              <div className="text-sm text-muted-foreground">Annette Grant - Engine Kit</div>
            </div>
            <span className="text-sm">$945.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceBestSellingProductsCard: React.FC = () => {
  return (
    <Card className="xl:col-span-4">
      <CardHeader>
        <CardTitle>Best Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Sports Shoe</span>
            <span className="text-sm">$316.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Black T-Shirt</span>
            <span className="text-sm">$279.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EcommerceDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">E-Commerce Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download />
              <span className="hidden lg:inline">Download</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid gap-4 lg:grid-cols-12">
            <EcommerceWelcomeCard />
            <EcommerceRevenueCard />
            <EcommerceSalesCard />
            <EcommerceNewCustomersCard />
          </div>

          {/* Second Row */}
          <div className="space-y-4 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">
            <EcommerceTotalRevenueCard />
            <EcommerceReturnRateCard />
          </div>

          {/* Third Row */}
          <div className="grid gap-4 lg:grid-cols-12">
            <EcommerceSalesByLocationCard />
            <EcommerceVisitBySourceCard />
            <EcommerceCustomerReviewsCard />
          </div>

          {/* Fourth Row */}
          <div className="space-y-4 xl:grid xl:grid-cols-12 xl:gap-4 xl:space-y-0">
            <EcommerceRecentOrdersCard />
            <EcommerceBestSellingProductsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EcommerceDashboard;
