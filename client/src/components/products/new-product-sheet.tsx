import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@radix-ui/react-select";
import { CardTitle } from "../ui/card";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewProductForm } from "./new-product-form";

interface NewProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewProductSheet({ open, onOpenChange }: NewProductProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader className="mb-5">
                    <SheetTitle>Add new product</SheetTitle>
                </SheetHeader>
                {/* <div className="grid gap-4 py-4">
                <div className="my-3">
                    <CardTitle className="text-base">Name</CardTitle>
                    <Input id="name" value={newProductName} placeholder="Name" onChange={e => setNewProductName(e.target.value)} className="mt-2" />
                </div>

                <div className="my-3">
                    <CardTitle className="text-base">Description</CardTitle>
                    <Textarea className="mt-2" value={newProductDescription} onChange={e => setNewProductDescription(e.target.value)} placeholder="Description" />
                </div>

                <div className="my-3">
                    <CardTitle className="text-base">Pricing</CardTitle>
                    <div className="flex items-center mt-2 gap-x-1">
                        <Input type="number" placeholder="0.00" value={newProductAmount} onChange={e => setNewProductAmount(Number(e.target.value))} className="" />
                        <Select value={newProductCurrency} onValueChange={value => setNewProductCurrency(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="usdc">USDC</SelectItem>
                                    <SelectItem value="usdt">USDT</SelectItem>
                                    <SelectItem value="eurc">EURC</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
            </div> */}

                {/* <SheetFooter>
                <SheetClose asChild>
                    <Button type="button">Cancel</Button>
                </SheetClose>

                <SheetClose asChild>
                    <Button type="submit">
                        Save changes
                    </Button>
                </SheetClose>

            </SheetFooter> */}
                <NewProductForm open={open} onOpenChange={onOpenChange} />
            </SheetContent>
        </Sheet>
    )
}