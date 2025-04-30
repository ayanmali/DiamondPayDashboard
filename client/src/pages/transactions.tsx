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
import { ChevronDown, DownloadIcon, FilterIcon } from "lucide-react"

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

import { createColumns } from "@/components/transactions/create-columns"

import { camelCaseToRegular } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Toggle } from "@/components/ui/toggle"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "recharts"

export type Transaction = {
    id: string
    amount: number,
    currency: string
    status: string,
    paymentMethod: string,
    description: string,
    customerEmail: string,
    date: Date,
    customerCurrencyUsed: string
}

const data: Transaction[] = [
    {
        id: "id",
        customerEmail: "walter@heisenberg.com",
        date: new Date(2025, 1, 30),
        paymentMethod: "0x93awfegegegg42t24gf2t24t24g3rg24t4ef13r2ty35hjyk754tf5g",
        amount: 911.00,
        currency: "USDC",
        status: "Succeeded",
        description: "hartwell",
        customerCurrencyUsed: "USDC"
    },
    {
        id: "id",
        customerEmail: "jesse@capncook.com",
        date: new Date(2025, 3, 13),
        paymentMethod: "0xA5J...9R7",
        amount: 420.00,
        currency: "USDT",
        status: "Failed",
        description: "b!tch",
        customerCurrencyUsed: "USDT"
    },
    {
        id: "id",
        customerEmail: "saul@sgassociates.com",
        date: new Date(2025, 2, 20),
        paymentMethod: "0xX19...7RY",
        amount: 69.00,
        currency: "EURC",
        status: "Succeeded",
        description: "did you know you have rights?",
        customerCurrencyUsed: "EURC"
    },
    {
        id: "id",
        customerEmail: "hank@schraderbrau.com",
        date: new Date(2025, 1, 11),
        paymentMethod: "0x7U6...JF9",
        amount: 100.00,
        currency: "USDC",
        status: "Pending",
        description: "makes me wanna cry",
        customerCurrencyUsed: "Base ETH"
    },
    {
        id: "id",
        customerEmail: "mike@lospollos.com",
        date: new Date(2025, 3, 29),
        paymentMethod: "0xG89...0D2",
        amount: 42.00,
        currency: "USDT",
        status: "Succeeded",
        description: "no half measures",
        customerCurrencyUsed: "Polygon ETH"
    },
]

export default function Transactions() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [sendReceiptDialogOpen, setSendReceiptDialogOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
    const { toast } = useToast()

    const [selectedStatus, setSelectedStatus] = useState<"all" | "succeeded" | "failed">("all");

    // Create the context value
    const dialogContextValue = {
        sendReceiptDialogOpen,
        setSendReceiptDialogOpen,
        currentTransaction,
        setCurrentTransaction,
        toast
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
                    <h1 className="text-2xl font-semibold leading-tight">Transactions</h1>
                    
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    {/* <Button variant="outline" className="mr-3 flex items-center">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button> */}
                    {/* <Button className="flex items-center" onClick={() => setNewCustomerDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Customer
          </Button> */}
                    {/* <AddNewCustomer open={newCustomerDialogOpen} onOpenChange={setNewCustomerDialogOpen}/> */}
                </div>
            </div>

            <div className="flex items-center justify-center space-x-5 pb-4">
                {/* All */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${
                        selectedStatus === "all" ? "border-2 border-primary" : "border"
                    }`}
                onClick={() => setSelectedStatus("all")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">All</div>
                    <div className="text-lg pb-2">911</div>
                </div>
                
                {/* Succeeded */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${
                        selectedStatus === "succeeded" ? "border-2 border-primary" : "border"
                    }`}
                onClick={() => setSelectedStatus("succeeded")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Succeeded</div>
                    <div className="text-lg pb-2">420</div>
                </div>
                
                {/* Failed */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${
                        selectedStatus === "failed" ? "border-2 border-primary" : "border"
                    }`}
                onClick={() => setSelectedStatus("failed")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Failed</div>
                    <div className="text-lg pb-2">69</div>
                </div>
                
                {/* <Toggle className="rounded-3xl border border-solid font-medium">First time customers</Toggle>
        <Toggle className="rounded-3xl border border-solid font-medium">Repeat customers</Toggle>
        <Toggle className="rounded-3xl border border-solid font-medium">Recent customers</Toggle> */}
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("customerEmail")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("customerEmail")?.setFilterValue(event.target.value)
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
                            <SelectItem value="highest-spend">Highest amount</SelectItem>
                            <SelectItem value="lowest-spend">Lowest amount</SelectItem>
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