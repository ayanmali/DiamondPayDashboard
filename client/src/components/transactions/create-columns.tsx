import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Transaction } from "@/pages/transactions";
import { ArrowUpDown, Check, CopyIcon, MoreHorizontal, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency, formatDate, truncateAddress } from "@/lib/utils";
import { SiCheckmarx, SiEthereum } from "react-icons/si";
import { IoTime, IoTimeOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
// import { EditDescriptionForm } from "./EditDescription";
// import { ViewAllPaymentMethodsData } from "./all-payment-methods";

// Create a context for customer dialogs
interface CustomerDialogsContextType {
    editDescDialogOpen: boolean;
    setEditDescDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    paymentMethodsDialogOpen: boolean;
    setPaymentMethodsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentTransaction: Transaction | null;
    setCurrentTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
}

// Table columns
export const createColumns = (dialogContext: CustomerDialogsContextType): ColumnDef<Transaction>[] => [
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
        id: "amountWithCurrency",
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
            <div className={"capitalize flex items-center bg-opacity-75 rounded-lg pl-3 pt-1 pb-1 pr-3 w-fit text-gray-600 " +
                ((row.getValue("status") as string).toLowerCase() === "succeeded" ? "bg-green-400"
                    : (row.getValue("status") as string).toLowerCase() === "failed" ? "bg-red-400" : "bg-orange-200")
            }>
                {row.getValue("status")}
                {(row.getValue("status") as string).toLowerCase() === "succeeded" ? <Check className="h-4 w-4 ml-2" />
                    : (row.getValue("status") as string).toLowerCase() === "failed" ? <XIcon className="h-4 w-4 ml-2" /> : <IoTimeOutline className="h-4 w-4 ml-2" />
                }
            </div>
        ),
    },
    {
        accessorKey: "customerEmail",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("customerEmail")}</div>,
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2 truncate">
                <SiEthereum />
                {truncateAddress(row.getValue("paymentMethod"))}
                <Button variant="ghost" size="icon" className="ml-1">
                    <CopyIcon className="h-3 w-3" />
                </Button>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <div className="capitalize">{formatDate(row.getValue("date"))}</div>
        ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const transaction = row.original
            const {
                editDescDialogOpen,
                setEditDescDialogOpen,
                paymentMethodsDialogOpen,
                setPaymentMethodsDialogOpen,
                currentTransaction,
                setCurrentTransaction
            } = dialogContext;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                        <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy transaction ID
              </DropdownMenuItem>

                        <DropdownMenuItem>Create invoice</DropdownMenuItem>
                        {/* <DropdownMenuItem>Create subscription</DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentTransaction(transaction);
                            setPaymentMethodsDialogOpen(true);
                        }}>
                            View payment methods
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentTransaction(transaction);
                            setEditDescDialogOpen(true);
                        }}>
                            Edit description
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    {/* Edit Customer Description Dialog */}
                    <Dialog open={editDescDialogOpen} onOpenChange={setEditDescDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit customer description</DialogTitle>
                                <div className="flex items-center gap-x-10">
                                    {/* <DialogTitle className="text-md">
                      {currentTransaction?.name}
                    </DialogTitle> */}
                                    {/* <DialogTitle className="text-sm font-normal text-muted-foreground">
                      {currentCustomer?.email}
                    </DialogTitle> */}
                                </div>

                                {/* <DialogDescription className="pt-5">
                    <EditDescriptionForm onSuccessfulSubmit={() => setEditDescDialogOpen(false)}
                    />
                  </DialogDescription> */}
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    {/* All Customer Payment Methods Dialog */}
                    <Dialog open={paymentMethodsDialogOpen} onOpenChange={setPaymentMethodsDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>View all payment methods</DialogTitle>
                                <div className="flex items-center gap-x-10">
                                    {/* <DialogTitle className="text-md">
                      {currentCustomer?.name}
                    </DialogTitle>
                    <DialogTitle className="text-sm font-normal text-muted-foreground">
                      {currentCustomer?.email}
                    </DialogTitle> */}
                                </div>

                                {/* <DialogDescription className="pt-5">
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription> */}
                                {/* <ViewAllPaymentMethodsData customerId={customer.id}/> */}
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </DropdownMenu>
            )
        },
    },
]