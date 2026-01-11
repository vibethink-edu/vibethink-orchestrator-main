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
import { formatBookingRange, type NormalizedWindow, type CivilDate, createResourceContext, type ResourceContext } from '@vibethink/utils';
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
} from "@vibethink/ui/icons";
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
  checkIn: CivilDate; // ✅ Cambiado a CivilDate
  checkOut: CivilDate; // ✅ Cambiado a CivilDate
  status: BookingStatus;
}

// ✅ CORRECTO: Usar CivilDate (YYYY-MM-DD) en lugar de strings hardcoded
const bookings: Booking[] = [
  {
    bookingId: "LG-B00108",
    guestName: "Angus Copper",
    roomType: "Deluxe",
    roomNumber: "Room 101",
    duration: "3 nights",
    checkIn: "2028-06-19" as CivilDate, // ✅ CivilDate format
    checkOut: "2028-06-22" as CivilDate,
    status: "Checked-In"
  },
  {
    bookingId: "LG-B00109",
    guestName: "Catherine Lopp",
    roomType: "Standard",
    roomNumber: "Room 202",
    duration: "2 nights",
    checkIn: "2028-06-19" as CivilDate,
    checkOut: "2028-06-21" as CivilDate,
    status: "Checked-In"
  },
  {
    bookingId: "LG-B00110",
    guestName: "Edgar Irving",
    roomType: "Suite",
    roomNumber: "Room 303",
    duration: "5 nights",
    checkIn: "2028-06-19" as CivilDate,
    checkOut: "2028-06-24" as CivilDate,
    status: "Pending"
  },
  {
    bookingId: "LG-B00111",
    guestName: "Ice B. Holand",
    roomType: "Standard",
    roomNumber: "Room 105",
    duration: "4 nights",
    checkIn: "2028-06-19" as CivilDate,
    checkOut: "2028-06-23" as CivilDate,
    status: "Checked-In"
  },
  {
    bookingId: "LG-B00112",
    guestName: "John Smith",
    roomType: "Deluxe",
    roomNumber: "Room 201",
    duration: "2 nights",
    checkIn: "2028-06-20" as CivilDate,
    checkOut: "2028-06-22" as CivilDate,
    status: "Pending"
  },
  {
    bookingId: "LG-B00113",
    guestName: "Mary Johnson",
    roomType: "Suite",
    roomNumber: "Room 401",
    duration: "7 nights",
    checkIn: "2028-06-21" as CivilDate,
    checkOut: "2028-06-28" as CivilDate,
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
      cell: ({ row }) => {
        // Formatear Room Number - extraer número si viene como "Room 101"
        const roomNumber = row.getValue("roomNumber") as string;
        const roomMatch = roomNumber.match(/\d+/);
        if (roomMatch) {
          return (
            <span className="text-foreground">
              {t('formatters.roomNumber', { number: roomMatch[0] })}
            </span>
          );
        }
        return <span className="text-foreground">{roomNumber}</span>;
      }
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
      cell: ({ row }) => {
        // Formatear duration - extraer número de "3 nights"
        const duration = row.getValue("duration") as string;
        const nightMatch = duration.match(/(\d+)\s*nights?/i);
        if (nightMatch) {
          const count = parseInt(nightMatch[1], 10);
          const key = count === 1 ? 'formatters.nights' : 'formatters.nightsPlural';
          return (
            <span className="text-foreground">
              {t(key, { count })}
            </span>
          );
        }
        return <span className="text-foreground">{duration}</span>;
      }
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
      cell: ({ row }) => {
        // ✅ CORRECTO: Usar formatBookingRange() con NormalizedWindow
        const { locale } = useTranslation('hotel');

        // ResourceContext mock (en producción vendría de configuración)
        const resourceCtx: ResourceContext = createResourceContext(
          'hotel_mock',
          'pms',
          'America/Cancun' // Timezone del hotel
        );

        // Crear NormalizedWindow
        const bookingWindow: NormalizedWindow = {
          kind: 'civil_range',
          domain: 'hotel',
          unit: 'night',
          resourceId: resourceCtx.resourceId,
          venueTimezone: resourceCtx.timeZone,
          checkInDate: row.original.checkIn,
          checkOutDate: row.original.checkOut,
        };

        // Formatear usando formatBookingRange() (respeta locale y timezone)
        return (
          <span className="text-foreground">
            {formatBookingRange(bookingWindow, locale, { includeDuration: false })}
          </span>
        );
      }
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

