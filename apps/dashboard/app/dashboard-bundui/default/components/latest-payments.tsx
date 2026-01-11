"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  type RowSelectionState
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Download,
  Mail,
  Tag,
  ChevronDown
} from "@vibethink/ui/icons";

import { Button } from "@vibethink/ui";
import { Checkbox } from "@vibethink/ui";
import { Input } from "@vibethink/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@vibethink/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@vibethink/ui";
import { Badge } from "@vibethink/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui";
import { useTranslation } from "@/lib/i18n";

interface Payment {
  id: string;
  status: "success" | "processing" | "failed";
  email: string;
  firstName: string;
  lastName: string;
  amount: number;
}

export function LatestPayments() {
  const { t } = useTranslation('default');
  const data = React.useMemo<Payment[]>(
    () => [
      {
        id: "1",
        status: "success",
        email: "ken99@yahoo.com",
        firstName: "Kenneth",
        lastName: "Thompson",
        amount: 316.0
      },
      {
        id: "2",
        status: "success",
        email: "abe45@gmail.com",
        firstName: "Abraham",
        lastName: "Lincoln",
        amount: 242.0
      },
      {
        id: "3",
        status: "processing",
        email: "monserrat44@gmail.com",
        firstName: "Monserrat",
        lastName: "Rodriguez",
        amount: 837.0
      },
      {
        id: "4",
        status: "success",
        email: "silas22@gmail.com",
        firstName: "Silas",
        lastName: "Johnson",
        amount: 874.0
      },
      {
        id: "5",
        status: "failed",
        email: "carmella@hotmail.com",
        firstName: "Carmella",
        lastName: "DeVito",
        amount: 721.0
      },
      {
        id: "6",
        status: "success",
        email: "maria@gmail.com",
        firstName: "Maria",
        lastName: "Garcia",
        amount: 529.0
      },
      {
        id: "7",
        status: "processing",
        email: "james34@outlook.com",
        firstName: "James",
        lastName: "Wilson",
        amount: 438.0
      },
      {
        id: "8",
        status: "success",
        email: "sarah.j@yahoo.com",
        firstName: "Sarah",
        lastName: "Jones",
        amount: 692.0
      },
      {
        id: "9",
        status: "failed",
        email: "robert55@gmail.com",
        firstName: "Robert",
        lastName: "Brown",
        amount: 512.0
      },
      {
        id: "10",
        status: "success",
        email: "emily.p@hotmail.com",
        firstName: "Emily",
        lastName: "Parker",
        amount: 375.0
      },
      {
        id: "11",
        status: "success",
        email: "david87@gmail.com",
        firstName: "David",
        lastName: "Miller",
        amount: 623.0
      },
      {
        id: "12",
        status: "processing",
        email: "jennifer@yahoo.com",
        firstName: "Jennifer",
        lastName: "Davis",
        amount: 459.0
      },
      {
        id: "13",
        status: "failed",
        email: "michael.s@hotmail.com",
        firstName: "Michael",
        lastName: "Smith",
        amount: 782.0
      },
      {
        id: "14",
        status: "success",
        email: "lisa.w@gmail.com",
        firstName: "Lisa",
        lastName: "Wilson",
        amount: 347.0
      },
      {
        id: "15",
        status: "success",
        email: "john.doe@outlook.com",
        firstName: "John",
        lastName: "Doe",
        amount: 594.0
      },
      {
        id: "16",
        status: "processing",
        email: "emma.j@gmail.com",
        firstName: "Emma",
        lastName: "Johnson",
        amount: 428.0
      }
    ],
    []
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const handleBulkAction = (action: string) => {
    const selectedRows = table.getSelectedRowModel().rows;

    // For demo purposes, let's just show what would happen
    if (action === "delete") {
      alert(t('payments.bulkActions.delete') + ` (${selectedRows.length})`);
    } else if (action === "export") {
      alert(t('payments.bulkActions.export') + ` (${selectedRows.length})`);
    } else if (action === "email") {
      alert(t('payments.bulkActions.email') + ` (${selectedRows.length})`);
    } else if (action === "tag") {
      alert(t('payments.bulkActions.tag') + ` (${selectedRows.length})`);
    }
  };

  const columns = React.useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={t('table.selectAll')}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t('table.selectRow')}
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "name",
        header: t('table.customer'),
        cell: ({ row }) => (
          <div>
            {row.original.firstName} {row.original.lastName}
          </div>
        )
      },
      {
        accessorKey: "email",
        header: t('table.email'),
        cell: ({ row }) => <div>{row.original.email}</div>
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">{t('table.amount')}</div>,
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.original.amount.toString());
          return <div className="text-right font-medium">${amount.toFixed(2)}</div>;
        }
      },
      {
        accessorKey: "status",
        header: t('table.status'),
        cell: ({ row }) => {
          const status = row.original.status;

          const statusMap = {
            success: "success",
            processing: "info",
            failed: "destructive"
          } as const;

          const statusClass = statusMap[status] ?? "default";

          return (
            <Badge variant={statusClass} className="capitalize">
              {status.replace("-", " ")}
            </Badge>
          );
        }
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="text-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>{t('payments.menu.viewDetails')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('payments.menu.downloadReceipt')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('payments.menu.contactCustomer')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8
      }
    }
  });

  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('payments.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={t('payments.filterPlaceholder')}
            className="max-w-sm"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          {selectedRowsCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {t('payments.actions')} <Badge variant="outline">{selectedRowsCount} {t('payments.selected')}</Badge>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                  <Trash2 />
                  {t('payments.bulkActions.delete')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("export")}>
                  <Download />
                  {t('payments.bulkActions.export')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("email")}>
                  <Mail />
                  {t('payments.bulkActions.email')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("tag")}>
                  <Tag />
                  {t('payments.bulkActions.tag')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
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
                    {t('table.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {t('payments.rowsSelected', { count: selectedRowsCount, total: data.length })}
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


