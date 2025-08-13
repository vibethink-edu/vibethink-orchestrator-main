/**
 * Products Page
 * VibeThink Orchestrator Dashboard
 * 
 * Following bundui-reference pattern with VibeThink adaptations
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card";
import { Badge } from "@/shared/components/bundui-premium/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/bundui-premium/components/ui/table";

// Mock data to avoid external dependencies
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: "$199.99",
    stock: 45,
    status: "active",
    sales: 234
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: "$149.99",
    stock: 23,
    status: "active",
    sales: 156
  },
  {
    id: 3,
    name: "USB Cable",
    category: "Accessories",
    price: "$24.99",
    stock: 0,
    status: "out_of_stock",
    sales: 89
  },
  {
    id: 4,
    name: "Smartwatch",
    category: "Electronics",
    price: "$299.99",
    stock: 12,
    status: "active",
    sales: 78
  },
  {
    id: 5,
    name: "Phone Case",
    category: "Accessories",
    price: "$19.99",
    stock: 67,
    status: "active",
    sales: 345
  }
];

const getStatusBadge = (status: string, stock: number) => {
  if (stock === 0 || status === "out_of_stock") {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (stock < 20) {
    return <Badge variant="secondary">Low Stock</Badge>;
  }
  return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
};

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product catalog and inventory.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
          <Button asChild>
            <Link href="/pages/products/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Total Sales</CardDescription>
              <CardTitle className="font-display text-2xl lg:text-3xl">$30,230</CardTitle>
              <div>
                <Badge variant="outline">
                  <span className="text-green-600">+20.1%</span>
                </Badge>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Number of Sales</CardDescription>
              <CardTitle className="font-display text-2xl lg:text-3xl">982</CardTitle>
              <div>
                <Badge variant="outline">
                  <span className="text-green-600">+5.02</span>
                </Badge>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Affiliate</CardDescription>
              <CardTitle className="font-display text-2xl lg:text-3xl">$4,530</CardTitle>
              <div>
                <Badge variant="outline">
                  <span className="text-green-600">+3.1%</span>
                </Badge>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Discounts</CardDescription>
              <CardTitle className="font-display text-2xl lg:text-3xl">$2,230</CardTitle>
              <div>
                <Badge variant="outline">
                  <span className="text-red-600">-3.58%</span>
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product List ({mockProducts.length})</CardTitle>
            <CardDescription>
              Manage your products and track their performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
                    <TableCell className="text-right">{product.sales}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
