"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useTranslation } from "@/lib/i18n";
import { Input } from "@vibethink/ui";
import { Badge } from "@vibethink/ui";
import { Button } from "@vibethink/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@vibethink/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@vibethink/ui";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Separator } from "@vibethink/ui";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@vibethink/ui";

type RoomType = "Deluxe" | "Standard" | "Suite";
type BookingStatus = "Checked-In" | "Pending";

interface Booking {
  bookingId: string;
  guestName: string;
  roomType: RoomType;
  roomNumber: string;
  duration: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
}

const bookings: Booking[] = [
  {
    bookingId: "LG-B00108",
    guestName: "Angus Copper",
    roomType: "Deluxe",
    roomNumber: "Room 101",
    duration: "3 nights",
    checkIn: "June 19, 2028",
    checkOut: "June 22, 2028",
    status: "Checked-In"
  },
  {
    bookingId: "LG-B00109",
    guestName: "Catherine Lopp",
    roomType: "Standard",
    roomNumber: "Room 202",
    duration: "2 nights",
    checkIn: "June 19, 2028",
    checkOut: "June 21, 2028",
    status: "Checked-In"
  },
  {
    bookingId: "LG-B00110",
    guestName: "Edgar Irving",
    roomType: "Suite",
    roomNumber: "Room 303",
    duration: "5 nights",
    checkIn: "June 19, 2028",
    checkOut: "June 24, 2028",
    status: "Pending"
  },
  {
    bookingId: "LG-B00111",
    guestName: "Ice B. Holand",
    roomType: "Standard",
    roomNumber: "Room 105",
    duration: "4 nights",
    checkIn: "June 19, 2028",
    checkOut: "June 23, 2028",
    status: "Checked-In"
  },
  {
    bookingId: "LG-B00112",
    guestName: "John Smith",
    roomType: "Deluxe",
    roomNumber: "Room 201",
    duration: "2 nights",
    checkIn: "June 20, 2028",
    checkOut: "June 22, 2028",
    status: "Pending"
  },
  {
    bookingId: "LG-B00113",
    guestName: "Mary Johnson",
    roomType: "Suite",
    roomNumber: "Room 401",
    duration: "7 nights",
    checkIn: "June 21, 2028",
    checkOut: "June 28, 2028",
    status: "Checked-In"
  }
];

// Columns moved inside component to use i18n

export function BookingList() {
  const { t } = useTranslation('hotel');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Booking>[] = useMemo(() => [
    {
      accessorKey: "bookingId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground px-0 font-normal hover:bg-transparent">
          {t('components.bookingList.table.headers.bookingId')}
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-foreground">{row.getValue("bookingId")}</span>
    },
    {
      accessorKey: "guestName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground px-0 font-normal hover:bg-transparent">
          {t('components.bookingList.table.headers.guestName')}
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-foreground">{row.getValue("guestName")}</span>
    },
    {
      accessorKey: "roomType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground px-0 font-normal hover:bg-transparent">
          {t('components.bookingList.table.headers.roomType')}
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const roomType = row.getValue("roomType") as string;
        const roomTypeKey = roomType.toLowerCase() as keyof typeof roomTypeMap;
        const translatedRoomType = roomTypeMap[roomTypeKey] || roomType;
        return (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime-400" />
            <Badge
              variant="outline"
              className="border-lime-300 bg-lime-50 font-normal text-lime-700 dark:border-lime-900 dark:bg-lime-950 dark:text-lime-300">
              {translatedRoomType}
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: "roomNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground px-0 font-normal hover:bg-transparent">
          {t('components.bookingList.table.headers.roomNumber')}
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-foreground">{row.getValue("roomNumber")}</span>
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground px-0 font-normal hover:bg-transparent">
          {t('components.bookingList.table.headers.duration')}
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-foreground">{row.getValue("duration")}</span>
    },
    {
      id: "checkInOut",
      accessorFn: (row) => row.checkIn,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground px-0 font-normal hover:bg-transparent">
          {t('components.bookingList.table.headers.checkInOut')}
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-foreground">
          {row.original.checkIn} - {row.original.checkOut}
        </span>
      )
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-muted-foreground px-0 font-normal hover:bg-transparent">
            {t('components.bookingList.table.headers.status')}
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as BookingStatus;
        const statusKey = status === "Checked-In" ? "checkedIn" : status.toLowerCase();
        const translatedStatus = t(`status.${statusKey}`) || status;
        return (
          <div className="flex justify-end">
            <Badge
              variant="outline"
              className={
                status === "Checked-In"
                  ? "border-lime-300 bg-lime-50 font-normal text-lime-700 dark:border-lime-900 dark:bg-lime-950 dark:text-lime-300"
                  : "border-yellow-300 bg-yellow-50 font-normal text-yellow-700"
              }>
              {translatedStatus}
            </Badge>
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === "all") return true;
        return row.getValue(columnId) === filterValue;
      }
    }
  ], [t]);

  const roomTypeMap: Record<string, string> = {
    deluxe: t('roomTypes.deluxe'),
    standard: t('roomTypes.standard'),
    suite: t('roomTypes.suite')
  };

  const table = useReactTable({
    data: bookings,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters
    },
    initialState: {
      pagination: {
        pageSize: 4
      }
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (value === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters([{ id: "status", value }]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <CardTitle>{t('components.bookingList.title')}</CardTitle>
          <div className="flex items-center gap-3">
            <InputGroup>
              <InputGroupInput
                placeholder={t('components.bookingList.search.placeholder')}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('components.bookingList.filters.allStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('components.bookingList.filters.allStatus')}</SelectItem>
                <SelectItem value="Checked-In">{t('status.checkedIn')}</SelectItem>
                <SelectItem value="Pending">{t('status.pending')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="bg-muted py-2 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('components.bookingList.table.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Separator />

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {t('components.bookingList.pagination.page', { 
                current: table.getState().pagination.pageIndex + 1, 
                total: table.getPageCount() 
              })}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                title={t('components.bookingList.pagination.first')}>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                title={t('components.bookingList.pagination.previous')}>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                title={t('components.bookingList.pagination.next')}>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                title={t('components.bookingList.pagination.last')}>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

