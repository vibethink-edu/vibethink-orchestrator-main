import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";

import { Button, Card, CardAction, CardDescription, CardHeader, CardTitle, Badge } from "@vibethink/ui";
import ProductList from "./product-list";

export const metadata: Metadata = {
  title: "Product List - VibeThink Orchestrator",
  description:
    "Product list page created using Tanstack Table. List or filter products. Built with shadcn/ui, Tailwind CSS and Next.js."
};

async function getProducts() {
  const data = await fs.readFile(
    path.join(process.cwd(), "apps/dashboard/app/dashboard-bundui/pages/products/data.json")
  );
  return JSON.parse(data.toString());
}

export default async function Page() {
  const products = await getProducts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link href="/dashboard/pages/products/create">
            <PlusIcon /> Add Product
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Sales</CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">$30,230</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <span className="text-green-600">+20.1%</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Number of Sales</CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">982</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <span className="text-green-600">+5.02</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Affiliate</CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">$4,530</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <span className="text-green-600">+3.1%</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Discounts</CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">$2,230</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <span className="text-red-600">-3.58%</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      <div className="pt-4">
        <ProductList data={products} />
      </div>
    </div>
  );
}


