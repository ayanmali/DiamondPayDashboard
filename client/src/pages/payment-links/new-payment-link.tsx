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

export type Product = {
    id: string,
    name: string,
    price: number
}

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
    const [collectedData, setCollectedData] = useState({
        collectAddress: false,
        requirePhone: false,
        limitPayments: false,
        collectTax: false
    });
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [customFieldsEnabled, setCustomFieldsEnabled] = useState(false);
    const [customFieldType, setCustomFieldType] = useState("text");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showTotalPaymentsErrMsg, setShowTotalPaymentsErrMsg] = useState(false);

    const mockProducts = [
        { id: "1", name: "Digital Course", price: 49.99 },
        { id: "2", name: "Monthly Subscription", price: 19.99 },
    ];

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

                    <Tabs defaultValue="payment-page" className="mb-8">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="payment-page" className="text-sm">Payment page</TabsTrigger>
                            <TabsTrigger value="after-payment" className="text-sm">After payment</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <PaymentLinkProductSelector/>

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
                                    <Label htmlFor="collect-address">
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
                                    <Label htmlFor="require-phone">
                                        Require customers to provide a phone number
                                    </Label>
                                    <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Checkbox
                                    id="limit-payments"
                                    checked={collectedData.limitPayments}
                                    onCheckedChange={(checked) =>
                                        setCollectedData({ ...collectedData, limitPayments: !!checked })
                                    }
                                />
                                <div className="ml-2">
                                    <Label htmlFor="limit-payments">
                                        Limit the number of payments
                                    </Label>
                                    <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
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
                                        <Label htmlFor="custom-fields" className="font-medium">
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
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                <div className="w-1/2 bg-gray-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-medium">Preview</h3>
                        <div className="flex border rounded-full p-1 bg-white">
                            <button className="px-2 py-1 rounded-full bg-white">
                                <SmartphoneIcon className="w-4 h-4" />
                            </button>
                            <button className="px-2 py-1 rounded-full">
                                <div className="w-4 h-4">💻</div>
                            </button>
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                        <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200">
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                                <div className="mr-1">🔒</div>
                                buy.diamondpay.dev
                            </div>
                            <div className="text-xs text-gray-500">
                                Use your domain
                            </div>
                        </div>

                        <div className="flex h-96">
                            <div className="w-1/2 bg-slate-700 p-6 flex flex-col">
                                <div className="text-xs text-yellow-300 inline-block mb-2 p-1 bg-gray-800 rounded">TEST MODE</div>

                                <div className="mt-auto">
                                    <div className="text-gray-300">
                                        {selectedProduct ? selectedProduct.name : "Product name"}
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">
                                        CA${selectedProduct ? selectedProduct.price : "0.00"}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {selectedProduct ? "Product description" : ""}
                                    </div>
                                </div>
                            </div>

                            <div className="w-1/2 p-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="preview-email" className="text-sm font-normal">
                                            Email
                                        </Label>
                                        <Input id="preview-email" className="mt-1" />
                                    </div>

                                    {customFieldsEnabled && (
                                        <div>
                                            <Label htmlFor="preview-custom-field" className="text-sm font-normal">
                                                Label name
                                            </Label>
                                            <Input id="preview-custom-field" className="mt-1" />
                                        </div>
                                    )}

                                    <div>
                                        <div className="text-sm mb-1">Payment method</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="border rounded p-3 flex items-center justify-center bg-gray-50">
                                                <CreditCard className="w-5 h-5 mr-2" />
                                                <span>Card</span>
                                            </div>
                                            <div className="border rounded p-3 flex items-center justify-center">
                                                <Apple className="w-5 h-5 mr-2" />
                                                <span>Apple Pay</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Button className="w-full bg-green-600 hover:bg-green-700">
                                            Pay
                                        </Button>
                                    </div>

                                    <div className="text-center text-xs text-gray-500">
                                        <div>Powered by stripe</div>
                                        <div className="flex justify-center gap-4 mt-1">
                                            <span>Terms</span>
                                            <span>Privacy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-500">
                        You can <a href="#" className="text-violet-600">enable more payment methods</a> and <a href="#" className="text-violet-600">change how this page looks</a> in your account settings.
                    </div>
                </div>
            </div>
        </div>
    );
}