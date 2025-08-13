/**
 * Orders Page
 * VibeThink Orchestrator Dashboard
 * 
 * Following bundui-reference pattern with VibeThink adaptations
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/bundui-premium/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/bundui-premium/components/ui/table";
import { Badge } from "@/shared/components/bundui-premium/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card";

// Mock data to avoid external dependencies
const mockOrders = [
  {
    id: 12342,
    customer: {
      name: "Liam Johnson",
      email: "liam@example.com"
    },
    price: "$200",
    type: "Sale",
    status: "pending",
    date: "Jun 23, 2023",
    product_name: "Wireless Headphones"
  },
  {
    id: 24342,
    customer: {
      name: "Emma Brown",
      email: "emma@example.com"
    },
    price: "$150",
    type: "Sale",
    status: "completed",
    date: "Jun 22, 2023",
    product_name: "Bluetooth Speaker"
  },
  {
    id: 34342,
    customer: {
      name: "Oliver Davis",
      email: "oliver@example.com"
    },
    price: "$75",
    type: "Return",
    status: "processed",
    date: "Jun 21, 2023",
    product_name: "USB Cable"
  },
  {
    id: 44342,
    customer: {
      name: "Sophie Wilson",
      email: "sophie@example.com"
    },
    price: "$300",
    type: "Sale",
    status: "completed",
    date: "Jun 20, 2023",
    product_name: "Smartwatch"
  },
  {
    id: 54342,
    customer: {
      name: "James Miller",
      email: "james@example.com"
    },
    price: "$120",
    type: "Sale",
    status: "canceled",
    date: "Jun 19, 2023",
    product_name: "Phone Case"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "processed":
      return <Badge variant="outline">Processed</Badge>;
    case "returned":
      return <Badge variant="destructive">Returned</Badge>;
    case "canceled":
      return <Badge variant="destructive">Canceled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === "overview") return true;
    return order.status === activeTab;
  });

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all your orders in one place.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Orders Management</h2>
          <Button asChild>
            <Link href="#">
              <PlusCircledIcon className="mr-2 h-4 w-4" /> Create Order
            </Link>
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader>
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.product_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-right font-medium">{order.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No orders found for the selected filter.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
