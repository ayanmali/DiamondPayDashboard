"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, DownloadIcon, FilterIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useState } from "react"

import { createColumns } from "@/components/customers/create-columns"

import { camelCaseToRegular } from "@/lib/utils"
import { AddNewCustomer } from "@/components/customers/add-new-customer"
import { Toggle } from "@/components/ui/toggle"

export type Customer = {
  name: string,
  id: string,
  email: string,
  joinedDate: Date,
  paymentMethod: string,
  totalSpent: number,
  orders: number,
  lastPaymentDate: Date,
  description: string,
  defaultCurrency: string
}

const data: Customer[] = [
  {
    name: "Walter",
    id: "id",
    email: "walter@heisenberg.com",
    joinedDate: new Date(2025, 1, 30),
    paymentMethod: "0x93awfegegegg42t24gf2t24t24g3rg24t4ef13r2ty35hjyk754tf5g",
    totalSpent: 911.00,
    orders: 20,
    lastPaymentDate: new Date(2025, 4, 20),
    description: "hartwell",
    defaultCurrency: "USDC"
  },
  {
    name: "Jesse",
    id: "id",
    email: "jesse@capncook.com",
    joinedDate: new Date(2025, 3, 13),
    paymentMethod: "0xA5J...9R7",
    totalSpent: 420.00,
    orders: 14,
    lastPaymentDate: new Date(2025, 3, 18),
    description: "b!tch",
    defaultCurrency: "EURC"
  },
  {
    name: "Saul",
    id: "id",
    email: "saul@sgassociates.com",
    joinedDate: new Date(2025, 2, 20),
    paymentMethod: "0xXI9...7RY",
    totalSpent: 69.00,
    orders: 4,
    lastPaymentDate: new Date(2025, 4, 25),
    description: "did you know you have rights?",
    defaultCurrency: "USDT"
  },
  {
    name: "Hank",
    id: "id",
    email: "hank@schraderbrau.com",
    joinedDate: new Date(2025, 1, 10),
    paymentMethod: "0x7U6...JF9",
    totalSpent: 100.00,
    orders: 7,
    lastPaymentDate: new Date(2025, 1, 11),
    description: "asac",
    defaultCurrency: "USDC"
  },
  {
    name: "Mike",
    id: "id",
    email: "mike@lospollos.com",
    joinedDate: new Date(2025, 2, 29),
    paymentMethod: "0xG89...0D2",
    totalSpent: 42.00,
    orders: 48,
    lastPaymentDate: new Date(2025, 4, 1),
    description: "for the chicken man",
    defaultCurrency: "EURC"
  },
]

export default function Customers() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [editDescDialogOpen, setEditDescDialogOpen] = useState(false);
  const [paymentMethodsDialogOpen, setPaymentMethodsDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);

  // Create the context value
  const dialogContextValue = {
    editDescDialogOpen,
    setEditDescDialogOpen,
    paymentMethodsDialogOpen,
    setPaymentMethodsDialogOpen,
    currentCustomer,
    setCurrentCustomer
  };

  // Create columns with the context
  const columns = createColumns(dialogContextValue);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">Customers</h1>
          
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {/* <Button variant="outline" className="mr-3 flex items-center">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          <Button className="flex items-center" onClick={() => setNewCustomerDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add customer
          </Button>
          <AddNewCustomer open={newCustomerDialogOpen} onOpenChange={setNewCustomerDialogOpen}/>
        </div>
      </div>

      <div className="flex justify-center space-x-5 pb-4 text-muted-foreground">
        <Toggle className="rounded-3xl border border-solid font-medium">First time customers</Toggle>
        <Toggle className="rounded-3xl border border-solid font-medium">Repeat customers</Toggle>
        <Toggle className="rounded-3xl border border-solid font-medium">Recent customers</Toggle>
        {/* <Button variant="ghost" className="rounded-3xl border border-solid">First time customers</Button>
        <Button variant="ghost" className="rounded-3xl border border-solid">Repeat customers</Button>
        <Button variant="ghost" className="rounded-3xl border border-solid">Recent customers</Button> */}
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Buttons aligned to the right */}
        <div className="ml-auto flex gap-x-3">
          {/* Sorting */}
          <Select defaultValue="newest">
            <SelectTrigger className="w-full md:w-[180px] ml-auto">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="highest-spend">Highest spend</SelectItem>
              <SelectItem value="lowest-spend">Lowest spend</SelectItem>
              <SelectItem value="last-paid">Last paid</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Toggle Selection */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {camelCaseToRegular(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Filters */}
          <Button variant="outline" className="flex items-center">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filter
          </Button>
              
          {/* Export Button */}
          <Button variant="outline" className="flex items-center">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        
      </div>

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
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}