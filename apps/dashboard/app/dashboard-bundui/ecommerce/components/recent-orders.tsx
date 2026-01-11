"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from "@vibethink/ui/icons";
import Link from "next/link";

import { Button } from "@vibethink/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@vibethink/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@vibethink/ui/components/table";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Avatar, AvatarImage } from "@vibethink/ui/components/avatar";
import { ExportButton } from "@/shared/components/CardActionMenus";
import { Input } from "@vibethink/ui/components/input";
import { Badge } from "@vibethink/ui/components/badge";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "@/lib/i18n";

export type Order = {
  id: number;
  customer: {
    name: string;
    image: string;
  };
  product: {
    name: string;
  };
  amount: number;
  status: "processing" | "paid" | "success" | "failed";
};

const orders: Order[] = [
  {
    id: 1023,
    customer: {
      name: "Theodore Bell",
      image: `/assets/images/avatars/01.png`
    },
    product: {
      name: "Tire Doodad"
    },
    amount: 300,
    status: "processing"
  },
  {
    id: 2045,
    customer: {
      name: "Amelia Grant",
      image: `/assets/images/avatars/02.png`
    },
    product: {
      name: "Engine Kit"
    },
    amount: 450,
    status: "paid"
  },
  {
    id: 3067,
    customer: {
      name: "Eleanor Ward",
      image: `/assets/images/avatars/03.png`
    },
    product: {
      name: "Brake Pad"
    },
    amount: 200,
    status: "success"
  },
  {
    id: 4089,
    customer: {
      name: "Henry Carter",
      image: `/assets/images/avatars/04.png`
    },
    product: {
      name: "Fuel Pump"
    },
    amount: 500,
    status: "processing"
  },
  {
    id: 5102,
    customer: {
      name: "Olivia Harris",
      image: `/assets/images/avatars/05.png`
    },
    product: {
      name: "Steering Wheel"
    },
    amount: 350,
    status: "failed"
  },
  {
    id: 6123,
    customer: {
      name: "James Robinson",
      image: `/assets/images/avatars/06.png`
    },
    product: {
      name: "Air Filter"
    },
    amount: 180,
    status: "paid"
  },
  {
    id: 7145,
    customer: {
      name: "Sophia Martinez",
      image: `/assets/images/avatars/07.png`
    },
    product: {
      name: "Oil Filter"
    },
    amount: 220,
    status: "success"
  },
  {
    id: 8167,
    customer: {
      name: "Liam Thompson",
      image: `/assets/images/avatars/08.png`
    },
    product: {
      name: "Radiator Cap"
    },
    amount: 290,
    status: "processing"
  },
  {
    id: 9189,
    customer: {
      name: "Emma Wilson",
      image: `/assets/images/avatars/09.png`
    },
    product: {
      name: "Spark Plug"
    },
    amount: 150,
    status: "success"
  },
  {
    id: 10211,
    customer: {
      name: "Noah Davis",
      image: `/assets/images/avatars/10.png`
    },
    product: {
      name: "Transmission Fluid"
    },
    amount: 120,
    status: "paid"
  },
  {
    id: 11233,
    customer: {
      name: "Ava Johnson",
      image: `/assets/images/avatars/01.png`
    },
    product: {
      name: "Battery Terminal"
    },
    amount: 85,
    status: "processing"
  },
  {
    id: 12255,
    customer: {
      name: "William Brown",
      image: `/assets/images/avatars/02.png`
    },
    product: {
      name: "Alternator"
    },
    amount: 420,
    status: "failed"
  },
  {
    id: 13277,
    customer: {
      name: "Charlotte Miller",
      image: `/assets/images/avatars/03.png`
    },
    product: {
      name: "Timing Belt"
    },
    amount: 380,
    status: "success"
  },
  {
    id: 14299,
    customer: {
      name: "Benjamin Taylor",
      image: `/assets/images/avatars/04.png`
    },
    product: {
      name: "Shock Absorber"
    },
    amount: 550,
    status: "processing"
  },
  {
    id: 15321,
    customer: {
      name: "Mia Anderson",
      image: `/assets/images/avatars/05.png`
    },
    product: {
      name: "Windshield Wiper"
    },
    amount: 95,
    status: "paid"
  },
  {
    id: 16343,
    customer: {
      name: "Elijah Thomas",
      image: `/assets/images/avatars/06.png`
    },
    product: {
      name: "Headlight Assembly"
    },
    amount: 320,
    status: "success"
  }
];


export function EcommerceRecentOrdersCard() {
  const { t } = useTranslation('ecommerce');
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );

  const columns: ColumnDef<Order>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: t('orders.columns.id'),
      cell: ({ row }) => (
        <Button variant="link" className="text-muted-foreground hover:text-primary h-auto p-0">
          <Link href="#">#{row.getValue("id")}</Link>
        </Button>
      )
    },
    {
      accessorKey: "customer",
      header: t('orders.columns.customer'),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={row.original.customer.image} />
          </Avatar>
          <div className="capitalize">{row.original.customer.name}</div>
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        return row.original.customer.name.toLowerCase().includes(filterValue.toLowerCase());
      }
    },
    {
      accessorKey: "product",
      header: t('orders.columns.product'),
      cell: ({ row }) => <div className="capitalize">{row.original.product.name}</div>
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0! hover:bg-transparent!">
            {t('orders.columns.amount')}
            <ArrowUpDown className="size-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      }
    },
    {
      accessorKey: "status",
      header: t('orders.columns.status'),
      cell: ({ row }) => {
        const status = row.original.status;

        const statusMap = {
          success: { variant: "default", className: "bg-green-500 hover:bg-green-600 border-transparent text-white" },
          processing: { variant: "secondary", className: "bg-blue-500 hover:bg-blue-600 border-transparent text-white" },
          paid: { variant: "secondary", className: "bg-yellow-500 hover:bg-yellow-600 border-transparent text-black" },
          failed: { variant: "destructive", className: "" }
        } as const;

        const statusConfig = statusMap[status] ?? { variant: "default", className: "" };

        return (
          <Badge variant={statusConfig.variant} className={cn("capitalize", statusConfig.className)}>
            {t(`status.${status}`)}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t('orders.menu.openMenu')}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(order.id))}>
                  {t('orders.menu.copyOrderId')}
                </DropdownMenuItem>
                <DropdownMenuItem>{t('orders.menu.viewCustomer')}</DropdownMenuItem>
                <DropdownMenuItem>{t('orders.menu.viewPaymentDetails')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    }
  ], [t]);

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
    pageCount: Math.ceil(orders.length / pageSize)
  });

  return (
    <Card className="lg:col-span-7">
      <CardHeader>
        <CardTitle>{t('orders.title')}</CardTitle>
        <CardAction className="relative">
          <ExportButton className="absolute end-0 top-0" />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder={t('orders.filterPlaceholder')}
          value={(table.getColumn("customer")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("customer")?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('orders.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {t('orders.showing', {
              from: pageIndex * pageSize + 1,
              to: Math.min((pageIndex + 1) * pageSize, orders.length),
              total: orders.length
            })}
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


