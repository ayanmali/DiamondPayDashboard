import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
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
import { Product } from "@/pages/payment-links/new-payment-link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

// Create a context for customer dialogs
interface ProductDialogsContextType {
    archiveProductDialogOpen: boolean;
    setArchiveProductDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentProduct: Product | null;
    setCurrentProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    toast: typeof toast
}

// Table columns
export const createColumns = (dialogContext: ProductDialogsContextType): ColumnDef<Product>[] => [
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
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className={"capitalize flex items-center bg-opacity-85 rounded-lg pl-3 pt-1 pb-1 pr-3 w-fit text-gray-600 " +
                ((row.getValue("status") as string).toLowerCase() === "active" ? "bg-green-400"
                    : (row.getValue("status") as string).toLowerCase() === "archived" ? "bg-slate-200" : "")
            }>
                {row.getValue("status")}
                
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
        accessorKey: "createdAt",
        header: "Created date",
        cell: ({ row }) => (
            <div className="capitalize">{formatDate(row.getValue("createdAt"))}</div>
        ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original
            const {
                archiveProductDialogOpen,
                setArchiveProductDialogOpen,
                currentProduct,
                setCurrentProduct,
                toast
            } = dialogContext;

            //const [emailInput, setEmailInput] = useState(currentProduct?.customerEmail as string);

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(product.id)}
                        >
                            Copy Product ID
                        </DropdownMenuItem>

                        <DropdownMenuItem
                        
                        >
                            Edit product
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentProduct(product);
                            setArchiveProductDialogOpen(true);
                        }}>
                            Archive product
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Create subscription</DropdownMenuItem> */}
                        {/* <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentProduct(Product);
                            setPaymentMethodsDialogOpen(true);
                        }}>
                            View customer
                        </DropdownMenuItem> */}
                        <DropdownMenuItem>
                            View customer
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentProduct(Product);
                            setEditDescDialogOpen(true);
                        }}>
                            View payment details
                        </DropdownMenuItem> */}
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                    <AlertDialog open={archiveProductDialogOpen} onOpenChange={setArchiveProductDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Archive product</AlertDialogTitle>
                                <AlertDialogDescription></AlertDialogDescription>
                                <AlertDialogDescription>
                                Archiving will hide this product from new purchases. Your existing payment links that use this product will be deactivated. Are you sure you want to archive this product?
                                </AlertDialogDescription>
                                <AlertDialogDescription>
                                    You can choose to unarchive this product at any time.
                                </AlertDialogDescription>
                                <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Archive</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenu>
            )
        },
    },
]