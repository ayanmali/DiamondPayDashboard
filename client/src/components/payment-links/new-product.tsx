import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

const NewProductSheet = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<number>(0.00);
    const [selectedCurrency, setSelectedCurrency]= useState<'usdc' | 'usdt' | 'eurc'>('usdc');

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div
                    className="p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center"

                >
                    <Plus className="w-4 h-4 mr-2 text-violet-500" />
                    <span className="text-sm">Add new product</span>
                </div>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add new product</SheetTitle>
                    {/* <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription> */}
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="my-3">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} placeholder="Name" onChange={e => setName(e.target.value)} className="mt-2" />
                    </div>
                    <div className="my-3">
                        <Label htmlFor="username" className="text-right">
                            Description
                        </Label>
                        <Textarea className="mt-2"/>
                    </div>

                    <div className="my-3">
                        <Label htmlFor="username" className="text-right">
                            Amount
                        </Label>

                        <div className="flex items-center mt-2 gap-x-1">
                            <Input type="number" placeholder="0.00" value={amount} className=""/>
                            <Select defaultValue="usdc">
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
                </div>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button">Cancel</Button>
                    </SheetClose>

                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>

                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default NewProductSheet;