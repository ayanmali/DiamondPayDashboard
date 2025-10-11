import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { NewWithdrawWalletForm } from "./new-withdraw-wallet-form";

export interface addNewCustomerProps {
    open: boolean
    onOpenChange: (state: boolean) => void
}

export function AddNewWithdrawWallet({ open, onOpenChange }: addNewCustomerProps) {
    // const [3removeEventListener, set24t] = useState(null);
    const [sameAsAccountEmailChecked, setSameAsAccountEmailChecked] = useState(false);

    return (
        <div className="mt-4 flex md:mt-0 md:ml-4">
            {/* New Wallet Button */}
            <Dialog open={open} onOpenChange={(open) => {
                onOpenChange(open);
                if (!open) {
                    setSameAsAccountEmailChecked(false);
                    // setEnteredWalletName(""); // Clear input when dialog closes
                    // setChainOption("");       // (Optional) Clear chain selection too
                }
            }}>
                {/* <DialogTrigger>
                    <Button className="flex items-center" onClick={() => (onOpenChange(true))}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Wallet
                    </Button>
                </DialogTrigger> */}
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <DialogHeader>
                        <DialogTitle>Add new withdrawal wallet</DialogTitle>
                        <DialogDescription>
                            {/* {chainOption === "EVM"
                                ? "This wallet will support any EVM blockchain (Ethereum Mainnet, Base, Polygon, Optimism, etc.)"
                                : chainOption === "SOL"
                                    ? "This wallet will only support the Solana blockchain."
                                    : "Enter a name and select a blockchain type for your new wallet."} */}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center">
                        <NewWithdrawWalletForm 
                        open={open} 
                        onOpenChange={onOpenChange}
                        />

                    </div>
                    {/* <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name"
                                placeholder="My Wallet"
                                className="col-span-3"
                                value={enteredWalletName}
                                onChange={e => setEnteredWalletName(e.target.value)}
                            />
                        </div>


                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Type
                            </Label>
                            <Select
                                onValueChange={(val) => setChainOption(val as ChainOptions)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a wallet type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Wallet Type</SelectLabel>
                                        <SelectItem value="EVM">EVM</SelectItem>
                                        <SelectItem value="SOL">Solana</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                    </div> */}

                    {/* <DialogFooter className="pt-5"> */}
                        
                        {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose> */}

                    {/* </DialogFooter> */}
                </DialogContent>
            </Dialog>
        </div>
    )
}