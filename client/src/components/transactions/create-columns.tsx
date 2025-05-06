import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Transaction } from "@/pages/transactions";
import { ArrowUpDown, Check, CopyIcon, DollarSignIcon, EuroIcon, MoreHorizontal, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate, truncateAddress } from "@/lib/utils";
import { SiEthereum, SiPolygon, SiTether } from "react-icons/si";
import { IoTimeOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { TbCurrencyEthereum } from "react-icons/tb";
import { InfoTooltip } from "../tooltips/info-tooltip";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { ToastAction } from "../ui/toast";
import { toast } from "@/hooks/use-toast";

// Create a context for customer dialogs
interface CustomerDialogsContextType {
    sendReceiptDialogOpen: boolean;
    setSendReceiptDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentTransaction: Transaction | null;
    setCurrentTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
    toast: typeof toast
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
                <Button variant="ghost" size="icon" className="ml-1" onClick={() => navigator.clipboard.writeText(row.getValue("paymentMethod"))}>
                    <CopyIcon className="h-3 w-3" />
                </Button>
            </div>
        ),
    },
    {
        accessorKey: "customerCurrencyUsed",
        header: ({ column }) => (
            <div className="flex items-center">
                Currency Used
                <InfoTooltip text="The currency the customer used to make the payment." />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {(row.getValue("customerCurrencyUsed") as string).toLowerCase() === "usdc" ? <DollarSignIcon className="h-4 w-4" />
                    : (row.getValue("customerCurrencyUsed") as string).toLowerCase() === "usdt" ? <SiTether className="h-4 w-4" />
                        : (row.getValue("customerCurrencyUsed") as string).toLowerCase() === "eurc" ? <EuroIcon className="h-4 w-4" />
                            : (row.getValue("customerCurrencyUsed") as string).toLowerCase() === "base eth" ? <TbCurrencyEthereum className="h-4 w-4" />
                                : (row.getValue("customerCurrencyUsed") as string).toLowerCase() === "polygon eth"
                                    || (row.getValue("customerCurrencyUsed") as string).toLowerCase() === "matic"
                                    ? <SiPolygon className="h-4 w-4" /> : <div></div>
                }
                {row.getValue("customerCurrencyUsed")}

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
                sendReceiptDialogOpen,
                setSendReceiptDialogOpen,
                currentTransaction,
                setCurrentTransaction,
                toast
            } = dialogContext;

            const [emailInput, setEmailInput] = useState(currentTransaction?.customerEmail as string);

            function isValidEmailList(input: string) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return input
                    .split(",")
                    .map(e => e.trim())
                    .filter(e => e.length > 0)
                    .every(email => emailRegex.test(email));
            }

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(transaction.id)}
                        >
                            Copy transaction ID
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentTransaction(transaction);
                            setSendReceiptDialogOpen(true);
                        }}>
                            Send receipt
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Create subscription</DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Connections</DropdownMenuLabel>
                        {/* <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentTransaction(transaction);
                            setPaymentMethodsDialogOpen(true);
                        }}>
                            View customer
                        </DropdownMenuItem> */}
                        <DropdownMenuItem>
                            View customer
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentTransaction(transaction);
                            setEditDescDialogOpen(true);
                        }}>
                            View payment details
                        </DropdownMenuItem> */}
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                    {/* Send receipt Dialog */}
                    <Dialog open={sendReceiptDialogOpen} onOpenChange={setSendReceiptDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Send receipt</DialogTitle>

                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Deliver to
                                    </Label>
                                    <Input
                                        id="name"
                                        value={emailInput}
                                        onChange={e => setEmailInput(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <span className="text-muted-foreground text-sm text-center">Separate multiple email addresses with commas.</span>

                            </div>
                            <DialogFooter>
                                <Button onClick={() => {
                                    currentTransaction?.customerEmail && setEmailInput(currentTransaction?.customerEmail);
                                    setSendReceiptDialogOpen(false);
                                }}>Cancel</Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (isValidEmailList(emailInput)) {
                                            setSendReceiptDialogOpen(false);
                                            const recipients = []
                                            for (const email of emailInput.split(',')) {
                                                recipients.push(email);
                                            }

                                            // ...send logic here...
                                            toast({
                                                title: "Receipt sent",
                                                description: "Sent receipt to " + recipients.toString(),
                                                action: (
                                                    <ToastAction altText="View receipt in email">View</ToastAction>
                                                ),
                                            })
                                        } else {
                                            alert("Please enter only valid email addresses.");
                                        }
                                    }}
                                >
                                    Send
                                </Button>

                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                </DropdownMenu>
            )
        },
    },
]