"use client";

/**
 * E-commerce Dashboard - Inspirado en external/bundui-premium + shadcnuikit.com
 * 
 * Dashboard completo de e-commerce que implementa:
 * - Revenue metrics con charts usando recharts
 * - Best selling products table con TanStack Table
 * - Recent orders management con avatars
 * - Sales by location analytics con progress bars
 * - Customer reviews system con ratings
 * - Store visits analytics mejoradas
 * 
 * Usando BunduiCompleteLayout + Inspiración de /external/bundui-premium
 */

import React, { useState } from 'react';
import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/bundui-premium/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/bundui-premium/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';

// Icons
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  ShoppingCart,
  MoreHorizontal,
  Star,
  MapPin,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Calendar
} from 'lucide-react';

// Mock data mejorado inspirado en bundui-premium
const revenueData = {
  total: "$125,231",
  change: "+20.1%",
  isPositive: true,
  description: "from last month",
  chartData: [
    { month: "Jan", revenue: 186 },
    { month: "Feb", revenue: 305 },
    { month: "Mar", revenue: 237 },
    { month: "Apr", revenue: 173 },
    { month: "May", revenue: 209 },
    { month: "Jun", revenue: 214 },
  ]
};

const salesData = {
  total: "20K",
  change: "-1.7%", 
  isPositive: false,
  description: "from last month",
  chartData: [
    { month: "Jan", sales: 120 },
    { month: "Feb", sales: 180 },
    { month: "Mar", sales: 160 },
    { month: "Apr", sales: 140 },
    { month: "May", sales: 190 },
    { month: "Jun", sales: 195 },
  ]
};

const customersData = {
  total: "3,602",
  change: "+36.5%",
  isPositive: true,
  description: "from last month"
};

// Productos con más detalles inspirados en bundui-premium
const bestSellingProducts = [
  {
    id: 1,
    name: "Sports Shoes",
    image: "https://bundui-images.netlify.app/products/01.jpeg",
    price: 316.00,
    sold: 316,
    stock: 10,
    category: "Footwear",
    sales: 85
  },
  {
    id: 2,
    name: "Black T-Shirt", 
    image: "https://bundui-images.netlify.app/products/02.jpeg",
    price: 274.00,
    sold: 274,
    stock: 20,
    category: "Clothing",
    sales: 74
  },
  {
    id: 3,
    name: "Jeans",
    image: "https://bundui-images.netlify.app/products/03.jpeg", 
    price: 195.00,
    sold: 195,
    stock: 15,
    category: "Clothing",
    sales: 65
  },
  {
    id: 4,
    name: "Red Sneakers",
    image: "https://bundui-images.netlify.app/products/04.jpeg",
    price: 402.00,
    sold: 402, 
    stock: 40,
    category: "Footwear",
    sales: 92
  },
  {
    id: 5,
    name: "Red Scarf",
    image: "https://bundui-images.netlify.app/products/05.jpeg",
    price: 280.00,
    sold: 280,
    stock: 37,
    category: "Accessories",
    sales: 68
  },
  {
    id: 6,
    name: "Kitchen Accessory",
    image: "https://bundui-images.netlify.app/products/06.jpeg",
    price: 150.00,
    sold: 150,
    stock: 18,
    category: "Home",
    sales: 45
  },
  {
    id: 7,
    name: "Bicycle", 
    image: "https://bundui-images.netlify.app/products/07.jpeg",
    price: 316.00,
    sold: 316,
    stock: 25,
    category: "Sports",
    sales: 78
  },
  {
    id: 8,
    name: "Gaming Headset",
    image: "https://bundui-images.netlify.app/products/08.jpeg",
    price: 290.00,
    sold: 290,
    stock: 12,
    category: "Electronics",
    sales: 82
  }
];

const recentOrders = [
  {
    id: "#1023",
    customer: "Theodore Bell",
    product: "Tire Doodad", 
    amount: "$300.00",
    status: "Processing",
    avatar: "TB"
  },
  {
    id: "#2045",
    customer: "Amelia Grant",
    product: "Engine Kit",
    amount: "$450.00", 
    status: "Paid",
    avatar: "AG"
  },
  {
    id: "#3067",
    customer: "Eleanor Ward",
    product: "Brake Pad",
    amount: "$200.00",
    status: "Success", 
    avatar: "EW"
  },
  {
    id: "#4089",
    customer: "Henry Carter",
    product: "Fuel Pump",
    amount: "$500.00",
    status: "Processing",
    avatar: "HC"
  },
  {
    id: "#5102",
    customer: "Olivia Harris", 
    product: "Steering Wheel",
    amount: "$350.00",
    status: "Failed",
    avatar: "OH"
  },
  {
    id: "#6123",
    customer: "James Robinson",
    product: "Air Filter", 
    amount: "$180.00",
    status: "Paid",
    avatar: "JR"
  },
  {
    id: "#7145",
    customer: "Sophia Martinez",
    product: "Oil Filter",
    amount: "$220.00",
    status: "Success",
    avatar: "SM"
  },
  {
    id: "#8167",
    customer: "Liam Thompson",
    product: "Radiator Cap",
    amount: "$290.00", 
    status: "Processing",
    avatar: "LT"
  }
];

const salesByLocation = [
  { country: "Canada", percentage: 85, change: "+5.2%" },
  { country: "Greenland", percentage: 80, change: "+7.8%" },
  { country: "Russia", percentage: 63, change: "-2.1%" },
  { country: "China", percentage: 60, change: "+3.4%" },
  { country: "Australia", percentage: 45, change: "+1.2%" },
  { country: "Greece", percentage: 40, change: "+1%" }
];

const customerReviews = {
  totalReviews: "5,500",
  averageRating: 4.5,
  ratings: [
    { stars: 5, count: 4000 },
    { stars: 4, count: 2100 },
    { stars: 3, count: 800 },
    { stars: 2, count: 631 },
    { stars: 1, count: 344 }
  ]
};

const EcommerceDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState("30 Jun 2025 - 27 Jul 2025");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'Paid': 
        return <Badge className="bg-blue-100 text-blue-800">Paid</Badge>;
      case 'Processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
            <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">E-Commerce Dashboard</h1>
            <p className="text-muted-foreground">
              Track your sales, products, and customer analytics
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 Jun 2025 - 27 Jul 2025">Last 30 days</SelectItem>
                <SelectItem value="1 Jun 2025 - 30 Jun 2025">Previous month</SelectItem>
                <SelectItem value="1 Jan 2025 - 31 Dec 2025">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Revenue Cards con Charts Mejorados */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Revenue Card con Mini Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.total}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {revenueData.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={revenueData.isPositive ? "text-green-600" : "text-red-600"}>
                  {revenueData.change}
                </span>
                <span className="ml-1">{revenueData.description}</span>
              </div>
              
              {/* Mini Chart */}
              <div className="mt-4 h-[60px]">
                <div className="flex items-end space-x-1 h-full">
                  {revenueData.chartData.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-primary/20 rounded-sm flex-1"
                      style={{ 
                        height: `${(item.revenue / 305) * 100}%`,
                        minHeight: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Card con Mini Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesData.total}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {salesData.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={salesData.isPositive ? "text-green-600" : "text-red-600"}>
                  {salesData.change}
                </span>
                <span className="ml-1">{salesData.description}</span>
              </div>
              
              {/* Mini Chart */}
              <div className="mt-4 h-[60px]">
                <div className="flex items-end space-x-1 h-full">
                  {salesData.chartData.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-blue-500/20 rounded-sm flex-1"
                      style={{ 
                        height: `${(item.sales / 195) * 100}%`,
                        minHeight: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Customers Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customersData.total}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {customersData.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={customersData.isPositive ? "text-green-600" : "text-red-600"}>
                  {customersData.change}
                </span>
                <span className="ml-1">{customersData.description}</span>
              </div>
              
              {/* Customer Growth Indicator */}
              <div className="mt-4">
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">75% of monthly target</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Best Selling Products - Mejorado con más detalles */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Best Selling Products</CardTitle>
                  <CardDescription>
                    Top performing products this month
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bestSellingProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={product.image} alt={product.name} />
                          <AvatarFallback>{product.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.category}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${product.price.toFixed(2)}
                        <div className="text-xs text-muted-foreground">
                          {product.sold} sold
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={product.sales} className="w-16 h-2" />
                          <span className="text-sm">{product.sales}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.stock > 20 ? "default" : product.stock > 10 ? "secondary" : "destructive"}
                        >
                          {product.stock} left
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Gift className="h-4 w-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentOrders.slice(0, 6).map((order) => (
                  <div key={order.id} className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{order.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.product}</p>
                      <p className="text-xs text-muted-foreground">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{order.amount}</div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid - Mejorado */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Sales by Location - Mejorado */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Sales by Location</CardTitle>
              <CardDescription>
                Revenue distribution by geographic region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByLocation.map((location) => (
                  <div key={location.country} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{location.country}</span>
                        <Badge 
                          variant={location.change.startsWith('+') ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {location.change}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{location.percentage}%</span>
                    </div>
                    <Progress value={location.percentage} className="h-2" />
                  </div>
                ))}
                
                {/* Total Revenue Summary */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total International Sales</span>
                    <span className="text-lg font-bold">$89,432</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across 6 countries this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews - Ultra Mejorado */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Customer Reviews & Ratings</CardTitle>
              <CardDescription>
                Based on {customerReviews.totalReviews} verified purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Rating Overview */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{customerReviews.averageRating}</div>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
                  </div>
                  
                  {/* Ratings Breakdown */}
                  <div className="flex-1 space-y-2">
                    {customerReviews.ratings.map((rating) => (
                      <div key={rating.stars} className="flex items-center space-x-2">
                        <span className="text-sm w-2">{rating.stars}</span>
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <Progress value={(rating.count / 4000) * 100} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {rating.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Recent Reviews</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sarah Johnson</span>
                          <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          "Amazing quality! The sports shoes exceeded my expectations. Great comfort and style."
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">March 12, 2025 • Sports Shoes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>MK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Mike Kumar</span>
                          <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                          ))}
                          <Star className="h-3 w-3 text-gray-300" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          "Good product, fast delivery. Would recommend to others."
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">March 10, 2025 • Black T-Shirt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
            </DashboardLayout>
  );
};

export default EcommerceDashboard;
