import { useState } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Input
} from "@/components/ui/input";
import {
    Label
} from "@/components/ui/label";
import {
    Button
} from "@/components/ui/button";
import {
    Checkbox
} from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, CreditCard, Plus, Info, Check, Apple, SmartphoneIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import PaymentLinkProductSelector from "@/components/payment-links/select-products";
import { InfoTooltip } from "@/components/tooltips/info-tooltip";
import PaymentLinkPreview from "@/components/payment-links/payment-link-preview";

export type Product = {
    id: string,
    name: string,
    description: string
    amount: number
    currency: string
}

// Products that have been added to the given payment link
export type AddedItem = {
    product: Product;
    price: number, // calculated based on the product's price and the payment link's price (i.e. conversion applied if necessary)
    quantity: number;
    allowQuantityAdjustment: boolean;
    isMain: boolean // whether the product is a main product or recommended product
};

const merchantName = "DiamondPay";

function PaymentLinksHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b bg-background">
            {/* Left section with close button and title */}
            <div className="flex items-center gap-3">
                <Link href="/payment-links">
                    <button className="p-2 hover:bg-gray-100 rounded-md">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </Link>
                <h1 className="text-base font-normal">Create payment link</h1>
            </div>

            {/* Right section with actions */}
            <div className="flex items-center gap-3">
                {/* <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Feedback?
                </button> */}

                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md border border-solid">
                    Hide preview
                </button>

                <button className="px-4 py-1.5 bg-[#7C3AED] text-white rounded-md text-sm font-medium hover:bg-[#6D28D9]">
                    Create link
                </button>
            </div>
        </header>
    );
}

export default function NewPaymentLinkPage() {
    const [paymentType, setPaymentType] = useState<"simple" | "flexible">("simple");
    const [currency, setCurrency] = useState<"usdc" | "usdt" | "eurc">("usdc");
    const [collectedData, setCollectedData] = useState({
        collectAddress: false,
        requirePhone: false,
        limitPayments: false,
        //collectTax: false
    });
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    // items that the user has added to the payment link
    const [addedItems, setAddedItems] = useState<AddedItem[]>(new Array<AddedItem>());
    const [customFieldsEnabled, setCustomFieldsEnabled] = useState(false);
    const [customFieldType, setCustomFieldType] = useState("text");
    const [showDropdown, setShowDropdown] = useState(false);

    const [showTotalPaymentsErrMsg, setShowTotalPaymentsErrMsg] = useState(false);

    return (
        <div className="flex flex-col h-full pt-16">
            {/* <header className="py-4 px-6 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-medium">Create a payment link</h2>
        <Button variant="outline" className="bg-violet-500 text-white hover:bg-violet-600">
          Create link <Check className="ml-2 w-4 h-4" />
        </Button>
      </header> */}
            <PaymentLinksHeader />
            <div className="flex flex-1">
                <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-base font-medium mb-2">Select type</h3>
                        <Select
                            value={paymentType}
                            onValueChange={v => setPaymentType(v as "simple" | "flexible")}
                            defaultValue="simple"
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="simple">Products</SelectItem>
                                <SelectItem value="flexible">Customers choose what to pay</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center">
                            <h3 className="text-base font-medium">Select currency</h3>
                            <InfoTooltip text="The currency in which you will receive payment."/>
                        </div>

                        <Select
                            value={currency}
                            onValueChange={v => setCurrency(v as "usdc" | "usdt" | "eurc")}
                            defaultValue="simple"
                        >
    
                            <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="usdc">USDC</SelectItem>
                                <SelectItem value="usdt">USDT</SelectItem>
                                <SelectItem value="eurc">EURC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Tabs defaultValue="payment-page" className="mb-8">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="payment-page" className="text-sm">Payment page</TabsTrigger>
                            <TabsTrigger value="after-payment" className="text-sm">After payment</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <PaymentLinkProductSelector addedItems={addedItems} setAddedItems={setAddedItems} currency={currency} isMain={true} />
                    <PaymentLinkProductSelector addedItems={addedItems} setAddedItems={setAddedItems} currency={currency} isMain={false} />

                    <div className="mb-8">
                        <h3 className="text-base font-medium mb-4">Options</h3>

                        <div className="space-y-3">
                            {/* Collect tax */}
                            {/* <div className="flex items-start">
                                <Checkbox
                                    id="collect-tax"
                                    checked={collectedData.collectTax}
                                    onCheckedChange={(checked) =>
                                        setCollectedData({ ...collectedData, collectTax: !!checked })
                                    }
                                />
                                <div className="ml-2">
                                    <Label htmlFor="collect-tax" className="font-medium">
                                        Collect tax automatically
                                    </Label>
                                    <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                </div>
                            </div> */}

                            <div className="flex items-start">
                                <Checkbox
                                    id="collect-address"
                                    checked={collectedData.collectAddress}
                                    onCheckedChange={(checked) =>
                                        setCollectedData({ ...collectedData, collectAddress: !!checked })
                                    }
                                />
                                <div className="ml-2">
                                    <Label htmlFor="collect-address" className="font-normal">
                                        Collect customers' addresses
                                    </Label>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Checkbox
                                    id="require-phone"
                                    checked={collectedData.requirePhone}
                                    onCheckedChange={(checked) =>
                                        setCollectedData({ ...collectedData, requirePhone: !!checked })
                                    }
                                />
                                <div className="ml-2">
                                    <Label htmlFor="require-phone" className="font-normal">
                                        Require customers to provide a phone number
                                    </Label>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="limit-payments"
                                    checked={collectedData.limitPayments}
                                    onCheckedChange={(checked) =>
                                        setCollectedData({ ...collectedData, limitPayments: !!checked })
                                    }
                                />
                                <div className="ml-2 flex items-center">
                                    <Label htmlFor="limit-payments" className="font-normal">
                                        Limit the number of payments
                                    </Label>
                                    <InfoTooltip text="The maximum number of payments this link is valid for. Once the limit is reached, customers will no longer be able to make a purchase using this link." />
                                </div>

                            </div>
                            {collectedData.limitPayments &&
                                <div className="flex items-center pb-2">
                                    <input
                                        type="number"
                                        min={1}
                                        className="pl-3 pt-1 pb-1 w-20"
                                        onChange={e => {
                                            Number(e.target.value) < 1 ?
                                                setShowTotalPaymentsErrMsg(true) :
                                                setShowTotalPaymentsErrMsg(false);
                                        }}
                                    ></input>
                                    <span className="text-sm text-muted-foreground ml-3">total payments</span>
                                </div>
                            }
                            {collectedData.limitPayments && showTotalPaymentsErrMsg && <span className="text-sm text-red-400">Max number of payments must be greater than 0.</span>
                            }

                        </div>
                    </div>

                    <Collapsible
                        open={advancedOpen}
                        onOpenChange={setAdvancedOpen}
                        className="mb-8"
                    >
                        <CollapsibleTrigger className="flex items-center text-base font-medium text-gray-800 mb-4">
                            Advanced options
                            {advancedOpen ? (
                                <ChevronUp className="ml-2 w-5 h-5" />
                            ) : (
                                <ChevronDown className="ml-2 w-5 h-5" />
                            )}
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Checkbox
                                        id="custom-fields"
                                        checked={customFieldsEnabled}
                                        onCheckedChange={(checked) =>
                                            setCustomFieldsEnabled(!!checked)
                                        }
                                    />
                                    <div className="ml-2">
                                        <Label htmlFor="custom-fields" className="font-normal">
                                            Add custom fields
                                        </Label>
                                        <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                    </div>
                                </div>

                                {customFieldsEnabled && (
                                    <div className="ml-7 space-y-3">
                                        <div className="flex gap-2">
                                            <Select
                                                value={customFieldType}
                                                onValueChange={setCustomFieldType}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                    <SelectItem value="dropdown">Dropdown</SelectItem>
                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Input placeholder="Label name" className="flex-1" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="default-value" />
                                            <Label htmlFor="default-value">
                                                Set a default value
                                            </Label>
                                            <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="set-limits" />
                                            <Label htmlFor="set-limits">
                                                Set limits
                                            </Label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="mark-optional" />
                                            <Label htmlFor="mark-optional">
                                                Mark as optional
                                            </Label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-x-2 my-3">
                                    <Select defaultValue="pay">
                                        <SelectTrigger className="w-max">
                                            <SelectValue placeholder="Select a call to action..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="pay">Pay</SelectItem>
                                                <SelectItem value="checkout">Checkout</SelectItem>
                                                <SelectItem value="book">Book</SelectItem>
                                                <SelectItem value="donate">Donate</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm">as the call to action</span>
                                </div>

                                {customFieldsEnabled && (
                                    <div className="ml-7 space-y-3">
                                        <div className="flex gap-2">
                                            <Select
                                                value={customFieldType}
                                                onValueChange={setCustomFieldType}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                    <SelectItem value="dropdown">Dropdown</SelectItem>
                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Input placeholder="Label name" className="flex-1" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="default-value" />
                                            <Label htmlFor="default-value">
                                                Set a default value
                                            </Label>
                                            <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="set-limits" />
                                            <Label htmlFor="set-limits">
                                                Set limits
                                            </Label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="mark-optional" />
                                            <Label htmlFor="mark-optional">
                                                Mark as optional
                                            </Label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                <PaymentLinkPreview merchantName={merchantName} addedItems={addedItems} currency={currency}/>
                {/* <Button onClick={() => addedItems.map(item => console.log(`Currency: ${currency} Price: ${item.price}`))}>click me</Button> */}
            </div>
        </div>
    );
}