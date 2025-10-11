import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Invoice } from "@/pages/invoices/invoices";
import { ArrowDownIcon, ArrowUpDown, Check, CopyIcon, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency, formatDate, truncateAddress } from "@/lib/utils";
import { IoTimeOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LiaEnvelopeOpenTextSolid } from "react-icons/lia";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Receiver, TokenTransfer } from "@/pages/wallet-activity/recent-activity";
import { Token, Wallet } from "@/pages/wallets";
import { SiEthereum, SiSolana } from "react-icons/si";
// Create a context for customer dialogs
interface WalletActivityDialogsContextType {
    newWithdrawWalletDialogOpen: boolean;
    setNewWithdrawWalletDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    changeNameDialogOpen: boolean;
    setChangeNameDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentTransfer: TokenTransfer | null;
    setCurrentTransfer: React.Dispatch<React.SetStateAction<TokenTransfer | null>>;
}

// Table columns
export const createColumns = (dialogContext: WalletActivityDialogsContextType): ColumnDef<TokenTransfer>[] => [
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
        accessorKey: "summary",
        header: "",
        cell: ({ row }) => {
            const { rawAmount, token, usdAmount } = row.original as { rawAmount: number, token: Token, usdAmount: number };
            return (
                <div>
                    <div className="flex items-center gap-x-2 mb-2">
                        <ArrowDownIcon className="h-4 w-4" />
                        <span>Sent</span>
                        <div className="font-medium">
                            {rawAmount.toPrecision(5)}
                        </div>

                        <div className="uppercase">
                            {token.ticker}
                        </div>
                    </div>
                    <span className="text-muted-foreground">{formatCurrency(usdAmount, "USD")}</span>
                    {/* <span>{formatCurrency(row.getValue("usdAmount"))}</span> */}
                </div>

            );
        },
    },
    {
        accessorKey: "receiver",
        header: "Receiver",
        cell: ({ row }) => {
            const { receiver } = row.original as { receiver: Receiver };
            return (
                <div>
                    <div className="flex items-center gap-x-3">
                        <div className="capitalize">{receiver.name}</div>
                        <span className="text-muted-foreground">{receiver.email}</span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        {receiver.address.toLowerCase().includes("0x") ? <SiEthereum className="h-4 w-4" /> : <SiSolana className="h-4 w-4" />}
                        <div className="flex items-center gap-x-2">
                            <Button variant="link" size="sm" className="p-0 text-muted-foreground" onClick={() => navigator.clipboard.writeText(receiver.address)}>
                                <span className="truncate text-muted-foreground">{truncateAddress(receiver.address)}</span>
                                <CopyIcon className="h-4 w-4 text-muted-foreground" onClick={() => navigator.clipboard.writeText(receiver.address)} />
                            </Button>
                        </div>
                    </div>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return row.original.receiver.name.toLowerCase().includes(value.toLowerCase());
        },
    },

    {
        accessorKey: "sendingWallet",
        header: "Sending Wallet",
        cell: ({ row }) => {
            const { sendingWallet } = row.original as { sendingWallet: Wallet };
            return (
                <div className="flex items-center gap-x-3">
                    {sendingWallet.walletType === "EVM" ? <SiEthereum className="h-4 w-4" /> : <SiSolana className="h-4 w-4" />}
                    <div>
                        <div className="capitalize">{sendingWallet.name}</div>
                        <div className="flex items-center gap-x-2">
                            <Button variant="link" size="sm" className="p-0 text-muted-foreground" onClick={() => navigator.clipboard.writeText(sendingWallet.address)}>
                                <span className="truncate text-muted-foreground">{truncateAddress(sendingWallet.address)}</span>
                                <CopyIcon className="h-4 w-4 text-muted-foreground" onClick={() => navigator.clipboard.writeText(sendingWallet.address)} />
                            </Button>
                        </div>


                    </div>
                </div>

            );
        },
    },

    // {
    //     accessorKey: "status",
    //     header: "Status",
    //     cell: ({ row }) => (
    //         <div className={"capitalize flex items-center bg-opacity-85 rounded-lg pl-3 pt-1 pb-1 pr-3 w-fit text-gray-600 " +
    //             ((row.getValue("status") as string).toLowerCase() === "active" ? "bg-green-400"
    //                 : (row.getValue("status") as string).toLowerCase() === "deactivated" ? "bg-red-300" : "")
    //         }>
    //             {row.getValue("status")}
    //             {(row.getValue("status") as string).toLowerCase() === "paid" ? <Check className="h-4 w-4 ml-2" />
    //                 : (row.getValue("status") as string).toLowerCase() === "overdue" ? <IoTimeOutline className="h-4 w-4 ml-2" />
    //                     : (row.getValue("status") as string).toLowerCase() === "outstanding" ? <LiaEnvelopeOpenTextSolid className="h-4 w-4 ml-2" /> : ""
    //             }
    //         </div>
    //     ),
    // },

    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("date") ? formatDate(row.getValue("date")) : ""}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const transfer = row.original
            const {
                newWithdrawWalletDialogOpen,
                setNewWithdrawWalletDialogOpen,
                changeNameDialogOpen,
                setChangeNameDialogOpen,
                currentTransfer,
                setCurrentTransfer,
            } = dialogContext;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                            setCurrentTransfer(transfer);
                        }}>
                            {/* <span className="sr-only">Open menu</span> */}
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem onSelect={(e) => {
                            //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            //setCurrentTransfer(transfer);
                            navigator.clipboard.writeText(transfer.txHash)
                        }}>
                            Copy transaction hash
                        </DropdownMenuItem>

                        <a href={`https://www.${transfer?.token.chain.toLowerCase()}scan.com/tx/${transfer?.txHash}`} target="_blank" rel="noopener noreferrer">
                            <DropdownMenuItem onSelect={(e) => {
                                //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                                //setCurrentTransfer(transfer);
                            }}>
                                View on block explorer
                            </DropdownMenuItem>
                        </a>

                        <DropdownMenuItem onSelect={(e) => {
                            //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            //setCurrentTransfer(transfer);
                        }}>
                            Preview payment link
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            //setCurrentTransfer(transfer);
                            setChangeNameDialogOpen(true);
                        }}>
                            Change name
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => {
                            //e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            //setCurrentTransfer(transfer);
                        }}>
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing dialog immediately
                            //setCurrentTransfer(transfer);
                            setNewWithdrawWalletDialogOpen(true);
                        }}>
                            Deactivate
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                    {/* <AlertDialog open={newWithdrawWalletDialogOpen} onOpenChange={setNewWithdrawWalletDialogOpen}>
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
                    </AlertDialog> */}

                    {/* <Dialog open={changeNameDialogOpen} onOpenChange={setChangeNameDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Change name</DialogTitle>
                                <DialogDescription>This name only appears on your dashboard, and your customers won't see it.</DialogDescription>

                                <DialogDescription className="pt-3">
                                    
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog> */}

                </DropdownMenu>

            )
        },
    },
]