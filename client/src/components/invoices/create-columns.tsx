import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Invoice } from "@/pages/invoices/invoices";
import { ArrowUpDown, Check, CopyIcon, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";
import { IoTimeOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { LiaEnvelopeOpenTextSolid } from "react-icons/lia";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

// Create a context for customer dialogs
interface CustomerDialogsContextType {
    deleteInvoiceDialogOpen: boolean;
    setDeleteInvoiceDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentInvoice: Invoice | null;
    setCurrentInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>;
    toast: typeof toast
}

// Table columns
export const createColumns = (dialogContext: CustomerDialogsContextType): ColumnDef<Invoice>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const { amount, currency } = row.original as { amount: number; currency: string };
            return (
                <div className="uppercase flex items-center gap-x-2">
                    <div className="font-medium">
                        {amount.toPrecision(5)}
                    </div>

                    <div className="text-muted-foreground">
                        {currency}
                    </div>
                </div>

            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className={"capitalize flex items-center bg-opacity-85 rounded-lg pl-3 pt-1 pb-1 pr-3 w-fit text-gray-600 " +
                ((row.getValue("status") as string).toLowerCase() === "paid" ? "bg-green-400"
                    : (row.getValue("status") as string).toLowerCase() === "overdue" ? "bg-orange-400"
                        : (row.getValue("status") as string).toLowerCase() === "outstanding" ? "bg-blue-300"
                            : (row.getValue("status") as string).toLowerCase() === "draft" ? "bg-gray-300" : "")
            }>
                {row.getValue("status")}
                {(row.getValue("status") as string).toLowerCase() === "paid" ? <Check className="h-4 w-4 ml-2" />
                    : (row.getValue("status") as string).toLowerCase() === "overdue" ? <IoTimeOutline className="h-4 w-4 ml-2" />
                        : (row.getValue("status") as string).toLowerCase() === "outstanding" ? <LiaEnvelopeOpenTextSolid className="h-4 w-4 ml-2" /> : ""
                }
            </div>
        ),
    },
    {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.getValue("invoiceNumber")}
                <Button variant="ghost" size="icon" className="ml-1" onClick={() => navigator.clipboard.writeText(row.getValue("invoiceNumber") as string)}>
                    <CopyIcon className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
    {
        accessorKey: "customerName",
        header: "Customer Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("customerName")}</div>,
    },
    {
        accessorKey: "customerEmail",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer Email
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("customerEmail")}</div>,
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("dueDate") ? formatDate(row.getValue("dueDate")) : ""}</div>
        ),
    },
    {
        accessorKey: "createdDate",
        header: "Created Date",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("createdDate") ? formatDate(row.getValue("createdDate")) : ""}</div>
        ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const invoice = row.original
            const {
                deleteInvoiceDialogOpen,
                setDeleteInvoiceDialogOpen,
                currentInvoice,
                setCurrentInvoice,
            } = dialogContext;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            {/* <span className="sr-only">Open menu</span> */}
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem onSelect={(e) => {
                            //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentInvoice(invoice);
                        }}>
                            Download PDF
                        </DropdownMenuItem>

                        {
                            invoice?.status.toLowerCase() === "draft" &&
                            <DropdownMenuItem onSelect={(e) => {
                                //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                                setCurrentInvoice(invoice);
                            }}>
                                Edit draft
                            </DropdownMenuItem>

                        }

                        {
                            (invoice?.status.toLowerCase() === "outstanding" || invoice?.status.toLowerCase() === "overdue")
                            &&
                            <DropdownMenuItem onSelect={(e) => {
                                //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                                setCurrentInvoice(invoice);
                            }}>
                                Edit invoice
                            </DropdownMenuItem>
                        }

                        {
                            invoice?.status.toLowerCase() === "draft" &&
                            <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault(); // Prevent dropdown from closing dialog immediately
                                setCurrentInvoice(invoice);
                                setDeleteInvoiceDialogOpen(true);
                            }}>
                                Delete draft invoice
                            </DropdownMenuItem>
                        }

                        {
                            (invoice?.status.toLowerCase() === "outstanding" || invoice?.status.toLowerCase() === "overdue")
                            &&
                            <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault(); // Prevent dropdown from closing dialog immediately
                                setCurrentInvoice(invoice);
                                setDeleteInvoiceDialogOpen(true);
                            }}>
                                Delete invoice
                            </DropdownMenuItem>
                        }

                        {/* <DropdownMenuItem>Create subscription</DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Connections</DropdownMenuLabel>

                        <DropdownMenuItem>
                            View customer
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                    <AlertDialog open={deleteInvoiceDialogOpen} onOpenChange={setDeleteInvoiceDialogOpen}>
                        
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the invoice and remove its data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenu>

            )
        },
    },
]