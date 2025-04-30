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

import { createColumns } from "@/components/payment-links/create-columns"

import { camelCaseToRegular } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export type PaymentLink = {
    name: string
    amount: number,
    currency: string
    status: string, // active or deactivated
    createdDate: Date,
    description: string,
    url: string
}

const data: PaymentLink[] = [
    {
        name: "Blue Sky",
        amount: 911.00,
        currency: "USDC",
        createdDate: new Date(2025, 1, 8),
        status: "Active",
        url: "www.ww.com",
        description: "say my name.",
    },
    {
        name: "Grass",
        amount: 420.00,
        currency: "USDC",
        createdDate: new Date(2025, 1, 8),
        status: "Deactivated",
        url: "www.ww.com",
        description: "1 to the 2 to the 3, ABQ what up biatch, leave it at the tone",
    },
]

export default function PaymentLinks() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [deactivatePLDialogOpen, setDeactivatePLDialogOpen] = useState(false);
    const [changeNameDialogOpen, setChangeNameDialogOpen] = useState(false);
    const [currentPl, setCurrentPl] = useState<PaymentLink | null>(null);
    const { toast } = useToast()

    const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "deactivated">("all");

    // Create the context value
    const dialogContextValue = {
        deactivatePLDialogOpen,
        setDeactivatePLDialogOpen,
        changeNameDialogOpen,
        setChangeNameDialogOpen,
        currentPl,
        setCurrentPl,
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
                    <h1 className="text-2xl font-semibold leading-tight">Payment Links</h1>
                    
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Button variant="outline" className="mr-3 flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
                    {/* <Button className="flex items-center" onClick={() => setNewCustomerDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Customer
          </Button> */}
                    {/* <AddNewCustomer open={newCustomerDialogOpen} onOpenChange={setNewCustomerDialogOpen}/> */}
                </div>
            </div>
            
            {/* Filter Cards */}
            <div className="flex items-center justify-center space-x-5 pb-4">
                {/* All */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${
                        selectedStatus === "all" ? "border-2 border-primary" : "border"
                    }`}
                onClick={() => setSelectedStatus("all")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">All</div>
                    <div className="text-lg pb-2">911</div>
                </div>
                
                {/* Active */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${
                        selectedStatus === "active" ? "border-2 border-primary" : "border"
                    }`}
                onClick={() => setSelectedStatus("active")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Active</div>
                    <div className="text-lg pb-2">420</div>
                </div>
                
                {/* Deactivated */}
                <div className={`w-48 cursor-pointer transition-all rounded-lg font-medium pl-3 text-lg bg-white ${
                        selectedStatus === "deactivated" ? "border-2 border-primary" : "border"
                    }`}
                onClick={() => setSelectedStatus("deactivated")}>
                    <div className="text-base font-semibold pt-2 text-muted-foreground">Deactivated</div>
                    <div className="text-lg pb-2">69</div>
                </div>
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
                        <SelectTrigger className="w-full md:w-[220px] ml-auto">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                            <SelectItem value="highest">Highest amount</SelectItem>
                            <SelectItem value="lowest">Lowest amount</SelectItem>
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