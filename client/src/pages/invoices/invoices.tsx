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
import { ChevronDown, DownloadIcon, FilterIcon, Plus } from "lucide-react"

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

import { createColumns } from "@/components/invoices/create-columns"

import { camelCaseToRegular } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Link } from "wouter"
import { Wallet } from "../wallets"

export type Invoice = {
    invoiceNumber: string
    amount: number,
    currency: string
    status: string, // Paid, Draft, Outstanding, Overdue, Cancelled, Pending
    customerName: string,
    customerEmail: string,
    dueDate: Date,
    send_at_utc: Date, // date to finalize and send the invoice
    createdDate: Date,
    datePaid: Date
    description: string,
    wallet: Wallet
}

export const testWallets: Wallet[] = [
    {
        id: "1",
        name: "MyWallet",
        address: "0x123456789",
        status: "active",
        walletType: "EVM",
        balances: [
            {
                token: {
                    name: "USDC",
                    ticker: "USDC",
                    chain: "Base",
                    address: "0x123456789",
                    decimals: 6
                },
                amount: 100.50,
                usdAmount: 69
            }
        ]
    },
    {
        id: "2",
        name: "OtherWallet",
        address: "0x987654321",
        status: "active",
        walletType: "EVM",
        balances: [
            {
                token: {
                    name: "USDC",
                    ticker: "USDC",
                    chain: "Base",
                    address: "0x123456789",
                    decimals: 6
                },
                amount: 42.24,
                usdAmount: 69
            }
        ]
    },
    {
        id: "3",
        name: "TradingWallet",
        address: "0x91142069000",
        status: "archived",
        walletType: "EVM",
        balances: [
            {
                token: {
                    name: "USDC",
                    ticker: "USDC",
                    chain: "Base",
                    address: "0x123456789",
                    decimals: 6
                },
                amount: 42.00,
                usdAmount: 69
            }
        ]
    },
]

const data: Invoice[] = [
    {
        invoiceNumber: "id",
        customerName: "Waltuh",
        customerEmail: "walter@heisenberg.com",
        createdDate: new Date(2025, 1, 8),
        send_at_utc: new Date(2025, 1, 9),
        datePaid: new Date(2025, 1, 30),
        dueDate: new Date(2025, 1, 9),
        amount: 911.00,
        currency: "USDC",
        status: "Paid",
        description: "say my name.",
        wallet: testWallets[0]
    },
    {
        invoiceNumber: "id",
        customerName: "Jesse",
        customerEmail: "jesse@capncook.com",
        createdDate: new Date(2025, 1, 8),
        send_at_utc: new Date(2025, 1, 9),
        datePaid: new Date(),
        dueDate: new Date(2025, 1, 9),
        amount: 420.00,
        currency: "EURC",
        status: "Draft",
        description: "yeah mr white yeah science",
        wallet: testWallets[1]
    },
    {
        invoiceNumber: "id",
        customerName: "Saul",
        customerEmail: "saul@sgassociates.com",
        createdDate: new Date(2025, 1, 8),
        send_at_utc: new Date(2025, 1, 9),
        datePaid: new Date(2025, 1, 30),
        dueDate: new Date(2025, 1, 9),
        amount: 911.00,
        currency: "USDC",
        status: "Outstanding",
        description: "don't drink and drive... but if you do, call me",
        wallet: testWallets[2]
    },
    {
        invoiceNumber: "id",
        customerName: "Gus",
        customerEmail: "gus@lospollos.com",
        createdDate: new Date(2025, 1, 8),
        send_at_utc: new Date(2025, 1, 9),
        datePaid: new Date(),
        dueDate: new Date(2025, 1, 9),
        amount: 420.00,
        currency: "USDT",
        status: "Overdue",
        description: "look at me hector",
        wallet: testWallets[0]
    },
]

export default function Invoices() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [deleteInvoiceDialogOpen, setDeleteInvoiceDialogOpen] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
    const { toast } = useToast()

    const [selectedStatus, setSelectedStatus] = useState<"all" | "paid" | "draft" | "outstanding" | "overdue">("all");

    // Create the context value
    const dialogContextValue = {
        deleteInvoiceDialogOpen,
        setDeleteInvoiceDialogOpen,
        currentInvoice,
        setCurrentInvoice,
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
                    <h1 className="text-2xl font-semibold leading-tight">Invoices</h1>
                    
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link href="/invoices/new">
                    <Button variant="outline" className="mr-3 flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        New
                    </Button>
                    </Link>
                    {/* <Button className="flex items-center" onClick={() => setNewCustomerDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Customer
          </Button> */}
                    {/* <AddNewCustomer open={newCustomerDialogOpen} onOpenChange={setNewCustomerDialogOpen}/> */}
                </div>
            </div>

            <div className="flex items-center justify-center space-x-5 pb-4">
                {/* All */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${selectedStatus === "all" ? "border-2 border-primary" : "border"
                    }`}
                    onClick={() => setSelectedStatus("all")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">All</div>
                    <div className="text-lg pb-2">911</div>
                </div>

                {/* Draft */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${selectedStatus === "draft" ? "border-2 border-primary" : "border"
                    }`}
                    onClick={() => setSelectedStatus("draft")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Draft</div>
                    <div className="text-lg pb-2">420</div>
                </div>

                {/* Outstanding */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${selectedStatus === "outstanding" ? "border-2 border-primary" : "border"
                    }`}
                    onClick={() => setSelectedStatus("outstanding")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Outstanding</div>
                    <div className="text-lg pb-2">69</div>
                </div>

                {/* Overdue */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${selectedStatus === "overdue" ? "border-2 border-primary" : "border"
                    }`}
                    onClick={() => setSelectedStatus("overdue")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Overdue</div>
                    <div className="text-lg pb-2">69</div>
                </div>

                {/* Paid */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${selectedStatus === "paid" ? "border-2 border-primary" : "border"
                    }`}
                    onClick={() => setSelectedStatus("paid")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Paid</div>
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
                    <Select defaultValue="newest-creation">
                        <SelectTrigger className="w-full md:w-[220px] ml-auto">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest-creation">Latest creation date first</SelectItem>
                            <SelectItem value="oldest-creation">Oldest creation date first</SelectItem>
                            <SelectItem value="newest-due">Latest due date first</SelectItem>
                            <SelectItem value="oldest-due">Oldest due date first</SelectItem>
                            <SelectItem value="newest-paid">Latest paid first</SelectItem>
                            <SelectItem value="oldest-paid">Oldest paid first</SelectItem>
                            <SelectItem value="highest-amount">Highest amount</SelectItem>
                            <SelectItem value="lowest-amount">Lowest amount</SelectItem>
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