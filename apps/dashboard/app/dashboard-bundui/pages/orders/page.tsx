import { Metadata } from "next";
import { promises as fs } from "fs";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import path from "path";

import { Button, Tabs, TabsList, TabsTrigger } from "@vibethink/ui";
import OrdersDataTable from "./data-table";

export const metadata: Metadata = {
  title: "Orders Page - VibeThink Orchestrator",
  description:
    "A list of orders generated using the Tanstack Table. Built with Tailwind CSS, shadcn/ui and Next.js."
};

async function getOrders() {
  const data = await fs.readFile(
    path.join(process.cwd(), "apps/dashboard/app/dashboard-bundui/pages/orders/data.json")
  );

  return JSON.parse(data.toString());
}

export default async function Page() {
  const orders = await getOrders();

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Orders</h1>
        <Button asChild>
          <Link href="#">
            <PlusIcon /> Create Order
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        <OrdersDataTable data={orders} />
      </Tabs>
    </div>
  );
}


