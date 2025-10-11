import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Invoice } from "@/pages/invoices/invoices";
import { ArrowUpDown, Check, CopyIcon, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";
import { IoTimeOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LiaEnvelopeOpenTextSolid } from "react-icons/lia";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { PaymentLink } from "@/pages/payment-links/payment-links";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { EditNameForm } from "./EditNameForm";
import { QRCodeSVG } from 'qrcode.react';
import { Card } from "../ui/card";

// Create a context for customer dialogs
interface PLDialogsContextType {
    deactivatePLDialogOpen: boolean;
    setDeactivatePLDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    changeNameDialogOpen: boolean;
    setChangeNameDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentPl: PaymentLink | null;
    setCurrentPl: React.Dispatch<React.SetStateAction<PaymentLink | null>>;
    generateQRDialogOpen: boolean;
    setGenerateQRDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Table columns
export const createColumns = (dialogContext: PLDialogsContextType): ColumnDef<PaymentLink>[] => [
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
                ((row.getValue("status") as string).toLowerCase() === "active" ? "bg-green-400"
                    : (row.getValue("status") as string).toLowerCase() === "deactivated" ? "bg-red-300" : "")
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
            const paymentLink = row.original
            const {
                deactivatePLDialogOpen,
                setDeactivatePLDialogOpen,
                changeNameDialogOpen,
                setChangeNameDialogOpen,
                currentPl,
                setCurrentPl,
                generateQRDialogOpen,
                setGenerateQRDialogOpen,
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
                            setCurrentPl(paymentLink);
                            navigator.clipboard.writeText(paymentLink.url)
                        }}>
                            Copy URL
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentPl(paymentLink);
                            setGenerateQRDialogOpen(true);
                        }}>
                            Generate QR Code
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentPl(paymentLink);
                        }}>
                            Preview payment link
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentPl(paymentLink);
                            setChangeNameDialogOpen(true);
                        }}>
                            Change name
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentPl(paymentLink);
                        }}>
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            setCurrentPl(paymentLink);
                            setDeactivatePLDialogOpen(true);
                        }}>
                            Deactivate
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                    <AlertDialog open={deactivatePLDialogOpen} onOpenChange={setDeactivatePLDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deactivate payment link</AlertDialogTitle>
                                <AlertDialogDescription></AlertDialogDescription>
                                <AlertDialogDescription>
                                    Customers will no longer be able to make a purchase using this link.
                                </AlertDialogDescription>
                                <AlertDialogDescription>
                                    You can choose to reactivate this payment link at any time.
                                </AlertDialogDescription>
                                <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Deactivate</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Dialog open={changeNameDialogOpen} onOpenChange={setChangeNameDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Change name</DialogTitle>
                                <DialogDescription>This name only appears on your dashboard, and your customers won't see it.</DialogDescription>

                                <DialogDescription className="pt-3">
                                    <EditNameForm currentName={currentPl?.name as string} onSuccessfulSubmit={() => setChangeNameDialogOpen(false)}
                                    />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={generateQRDialogOpen} onOpenChange={setGenerateQRDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>QR Code</DialogTitle>
                                <DialogDescription>
                                    Scan this QR code to access the payment link
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center p-4">
                                <QRCodeSVG 
                                    value={currentPl?.url as string}
                                    size={256}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                </DropdownMenu>

            )
        },
    },
]