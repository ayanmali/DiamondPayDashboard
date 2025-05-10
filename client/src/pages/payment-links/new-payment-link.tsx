import { useEffect, useState } from "react";

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
    Checkbox
} from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlertTriangle, ChevronDown, ChevronUp, DollarSign, Info } from "lucide-react";
import { Link } from "wouter";
import PaymentLinkProductSelector from "@/components/payment-links/new/payment-page/select-products";
import { InfoTooltip } from "@/components/tooltips/info-tooltip";
import PaymentLinkPreview, { CartItem } from "@/components/payment-links/new/payment-page/payment-link-preview";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import PostPaymentPagePreview from "@/components/payment-links/new/post-payment/post-payment-page-preview";
import { Wallet } from "../wallets";
import { formatCryptoAmount, truncateAddress } from "@/lib/utils";
import { calculateTotal } from "@/lib/cart-utils";

export type Product = {
    id: string,
    name: string,
    description: string
    amount: number
    currency: string
    createdAt: Date
    status: string
}

export type CustomField = {
    id: string; // unique identifier
    fieldType: 'text' | 'number' | 'dropdown' | 'checkbox';
    labelName: string;
    defaultValue?: string;
    options?: string[]; // for dropdown
    minLimit?: number;
    maxLimit?: number;
    optional?: boolean;
};

// Products that have been added to the given payment link
export type AddedItem = {
    product: Product;
    price: number, // calculated based on the product's price and the payment link's price (i.e. conversion applied if necessary)
    quantity: number;
    allowQuantityAdjustment: boolean;
    isMain: boolean // whether the product is a main product or recommended product
};

const merchantName = "Plexus";
const MAX_LABEL_NAME_LENGTH = 30;
const MAX_LABEL_DEFAULT_VALUE_LENGTH = 50;
const MIN_LABEL_NAME_LENGTH = 1;

export const testWallets: Wallet[] = [
    {
        id: "1",
        name: "MyWallet",
        address: "0x123456789",
        status: "active",
        walletType: "EVM",
        balances: [
            {
                token: {
                    name: "USDC",
                    ticker: "USDC",
                    chain: "Base"
                },
                amount: 100.50,
                usdAmount: 69
            }
        ]
    },
    {
        id: "2",
        name: "OtherWallet",
        address: "0x987654321",
        status: "active",
        walletType: "EVM",
        balances: [
            {
                token: {
                    name: "USDC",
                    ticker: "USDC",
                    chain: "Base"
                },
                amount: 42.24,
                usdAmount: 69
            }
        ]
    },
    {
        id: "3",
        name: "TradingWallet",
        address: "0x91142069000",
        status: "archived",
        walletType: "EVM",
        balances: [
            {
                token: {
                    name: "USDC",
                    ticker: "USDC",
                    chain: "Base"
                },
                amount: 42.00,
                usdAmount: 69
            }
        ]
    },
]

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

                {/* <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md border border-solid">
                    Hide preview
                </button> */}
                <Link href="/payment-links/id">
                    <button className="px-4 py-1.5 bg-[#7C3AED] text-white rounded-md text-sm font-medium hover:bg-[#6D28D9]">
                        Create link
                    </button>
                </Link>
            </div>
        </header>
    );
}

export default function NewPaymentLinkPage() {
    const [selectedTab, setSelectedTab] = useState<'payment' | 'post-payment'>('payment');
    const [paymentType, setPaymentType] = useState<"simple" | "flexible">("simple");
    const [currency, setCurrency] = useState<"usdc" | "usdt" | "eurc">("usdc");
    const [wallet, setWallet] = useState<Wallet>(testWallets[0]);
    const [collectedData, setCollectedData] = useState({
        // collectAddress: false,
        requirePhone: false,
        limitPayments: false,
        //collectTax: false
    });
    const [customFields, setCustomFields] = useState<CustomField[]>([]);
    const [cta, setCta] = useState('Pay');
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    // items that the user has added to the payment link
    const [addedItems, setAddedItems] = useState<AddedItem[]>(new Array<AddedItem>());
    const [cart, setCart] = useState<CartItem[]>(
        addedItems.filter(i => i.isMain).map(addedItem => ({ addedItem: addedItem, quantity: addedItem.quantity }))
    );
    const [customFieldsEnabled, setCustomFieldsEnabled] = useState(false);
    const [customFieldType, setCustomFieldType] = useState("text");
    const [labelNameErr, setLabelNameErr] = useState(false);
    const [labelDefaultValueErr, setLabelDefaultValueErr] = useState(false);

    const [showTotalPaymentsErrMsg, setShowTotalPaymentsErrMsg] = useState(false);

    const [customFieldErrors, setCustomFieldErrors] = useState<{ labelName: boolean; defaultValue: boolean }[]>([]);

    // Post payment
    const [useCustomMessage, setUseCustomMessage] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(true);
    const [customMessage, setCustomMessage] = useState<string>('');
    const [redirectUrl, setRedirectUrl] = useState<string>('');
    const [createInvoice, setCreateInvoice] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('payment');
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
    const [urlError, setUrlError] = useState<string>('');

    useEffect(() => {
        setCart(prevCart =>
            addedItems.map(addedItem => {
                if (addedItem.isMain) {
                    // For main items, keep their quantities the same
                    return {
                        addedItem,
                        quantity: addedItem.quantity
                    };
                }

                // Check if the item already exists in the cart
                const existing = prevCart.find(c => c.addedItem.product.id === addedItem.product.id);
                if (existing) {
                    // If it exists, keep its quantity
                    return {
                        addedItem,
                        // quantity: Math.max(existing.quantity, addedItem.quantity)
                        quantity: addedItem.quantity
                    };
                }

                // If it's not a main item and doesn't exist in the cart, return null
                return null;
            }).filter(item => item !== null) // Filter out null values
        );
    }, [addedItems]);

    // Get products that are in the cart
    const cartProducts = addedItems.filter(addedItem =>
        cart.some(item => item.addedItem.product.id === addedItem.product.id && item.quantity > 0)
    );
    // Format the total amount
    const totalAmount = `${formatCryptoAmount(calculateTotal(addedItems, cart), currency)}`;

    // URL validation function
    const validateUrl = (url: string) => {
        const urlPattern = new RegExp('^(https?://)?(www\\.)?([a-zA-Z0-9]+\\.[a-zA-Z]{2,})(/.*)?$');
        return urlPattern.test(url);
    };

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
                            <TabsTrigger value="payment-page" className="text-sm" onClick={() => setSelectedTab('payment')}>Payment page</TabsTrigger>
                            <TabsTrigger value="after-payment" className="text-sm" onClick={() => setSelectedTab('post-payment')}>After payment</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {selectedTab === 'payment' &&
                        <>
                            <div className="mb-8">
                                <div className="flex items-center">
                                    <h3 className="text-base font-medium">Select currency</h3>
                                    <InfoTooltip text="The currency in which you will receive payment." />
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

                            <div className="mb-8">
                                <div className="flex items-center">
                                    <h3 className="text-base font-medium">Select wallet</h3>
                                    <InfoTooltip text="The wallet in which you will receive payment." />
                                </div>

                                <Select
                                    value={wallet.name}
                                    onValueChange={v =>
                                        setWallet(
                                            testWallets.find(w => w.name === v) as Wallet
                                        )
                                    }
                                    defaultValue={wallet.name}
                                >
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Select wallet" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {testWallets.map(w => (
                                            <SelectItem key={w.id} value={w.name}>
                                                <div>
                                                    <div className="font-medium">{w.name}</div>
                                                    <div className="text-sm text-gray-500">{truncateAddress(w.address)}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-sm text-muted-foreground">
                                    {wallet.walletType === "EVM" ? "This payment link will accept payments from any EVM blockchain (Base, Polygon, Optimism, etc.)."
                                        : wallet.walletType === "SOL" ? "This payment link will accept payment only on the Solana network." : ""}
                                </span>


                            </div>

                            <PaymentLinkProductSelector addedItems={addedItems} setAddedItems={setAddedItems} currency={currency} isMain={true} invoice={false} />
                            <PaymentLinkProductSelector addedItems={addedItems} setAddedItems={setAddedItems} currency={currency} isMain={false} invoice={false} />

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

                                    {/* <div className="flex items-start">
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
                            </div> */}

                                    <div className="flex items-center">
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
                                    <div className="pt-3 space-y-4">
                                        <div className="flex items-center">
                                            <Checkbox
                                                id="custom-fields"
                                                checked={customFieldsEnabled}
                                                onCheckedChange={(checked) =>
                                                    setCustomFieldsEnabled(!!checked)
                                                }
                                            />
                                            <div className="ml-2 flex items-center">
                                                <Label htmlFor="custom-fields" className="font-normal">
                                                    Add custom fields
                                                </Label>
                                                <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
                                            </div>
                                        </div>

                                        {customFieldsEnabled && (
                                            <div className="ml-7 space-y-4">
                                                {customFields.map((field, idx) => (
                                                    <div key={field.id} className="flex flex-col gap-2 border p-3 rounded-md bg-gray-50">
                                                        <div className="flex gap-2 items-center">
                                                            <Select
                                                                value={field.fieldType}
                                                                onValueChange={val => {
                                                                    field.defaultValue = '';
                                                                    setCustomFields(fields =>
                                                                        fields.map((f, i) =>
                                                                            i === idx ? { ...f, fieldType: val as CustomField['fieldType'], options: val === 'dropdown' ? ['Option 1'] : undefined } : f
                                                                        )
                                                                    )
                                                                }
                                                                }
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue placeholder="Type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="text">Text</SelectItem>
                                                                    <SelectItem value="number">Number</SelectItem>
                                                                    {/* <SelectItem value="dropdown">Dropdown</SelectItem> */}
                                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <Input
                                                                placeholder="Label"
                                                                value={field.labelName}
                                                                onChange={e => {
                                                                    const value = e.target.value;
                                                                    setCustomFields(fields =>
                                                                        fields.map((f, i) => (i === idx ? { ...f, labelName: value } : f))
                                                                    );
                                                                    setCustomFieldErrors(errors =>
                                                                        errors.map((err, i) =>
                                                                            i === idx
                                                                                ? { ...err, labelName: value.length > MAX_LABEL_NAME_LENGTH || value.length < MIN_LABEL_NAME_LENGTH }
                                                                                : err
                                                                        )
                                                                    );
                                                                }}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                className="text-red-500"
                                                                onClick={() => {
                                                                    setCustomFields(fields => fields.filter((_, i) => i !== idx));
                                                                    setCustomFieldErrors(errors => errors.filter((_, i) => i !== idx));
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>

                                                        {customFieldErrors[idx]?.labelName && (
                                                            <span className="text-red-500 text-sm">{`Label name must be greater than ${MIN_LABEL_NAME_LENGTH} character and no more than ${MAX_LABEL_NAME_LENGTH} characters in length.`}</span>
                                                        )}

                                                        {field.fieldType !== 'checkbox' && (
                                                            <>
                                                                <div className="mt-3 mb-3">
                                                                    <Input
                                                                        placeholder="Default value"
                                                                        value={field.defaultValue ?? ''}
                                                                        onChange={e => {
                                                                            const value = e.target.value;
                                                                            setCustomFields(fields =>
                                                                                fields.map((f, i) => (i === idx ? { ...f, defaultValue: value } : f))
                                                                            );
                                                                            setCustomFieldErrors(errors =>
                                                                                errors.map((err, i) =>
                                                                                    i === idx
                                                                                        ? { ...err, defaultValue: value.length > MAX_LABEL_DEFAULT_VALUE_LENGTH }
                                                                                        : err
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="flex-1"
                                                                    />
                                                                    {customFieldErrors[idx]?.defaultValue && (
                                                                        <span className="text-red-500 text-sm">{`Default value must be no more than ${MAX_LABEL_DEFAULT_VALUE_LENGTH} characters in length.`}</span>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        checked={!!field.optional}
                                                                        onCheckedChange={checked =>
                                                                            setCustomFields(fields =>
                                                                                fields.map((f, i) =>
                                                                                    i === idx ? { ...f, optional: checked ? true : false } : f
                                                                                )
                                                                            )
                                                                        }
                                                                    />
                                                                    <span className="text-sm">Make field optional</span>
                                                                </div>
                                                            </>
                                                        )}
                                                        {field.fieldType === 'checkbox' && (
                                                            <div className="flex items-center gap-2 mt-4 mb-2">
                                                                <Checkbox
                                                                    checked={!!field.defaultValue}
                                                                    onCheckedChange={checked =>
                                                                        setCustomFields(fields =>
                                                                            fields.map((f, i) =>
                                                                                i === idx ? { ...f, defaultValue: checked ? 'true' : '' } : f
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                                <span className="text-sm">Default checked</span>
                                                            </div>
                                                        )}

                                                        {field.fieldType === 'dropdown' && (
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs text-gray-500">Dropdown options:</span>
                                                                {field.options?.map((opt, oidx) => (
                                                                    <div key={oidx} className="flex gap-2 items-center">
                                                                        <Input
                                                                            value={opt}
                                                                            onChange={e =>
                                                                                setCustomFields(fields =>
                                                                                    fields.map((f, i) =>
                                                                                        i === idx
                                                                                            ? {
                                                                                                ...f,
                                                                                                options: f.options?.map((o, oi) =>
                                                                                                    oi === oidx ? e.target.value : o
                                                                                                ),
                                                                                            }
                                                                                            : f
                                                                                    )
                                                                                )
                                                                            }
                                                                            className="flex-1"
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            className="text-red-500"
                                                                            onClick={() =>
                                                                                setCustomFields(fields =>
                                                                                    fields.map((f, i) =>
                                                                                        i === idx
                                                                                            ? {
                                                                                                ...f,
                                                                                                options: f.options?.filter((_, oi) => oi !== oidx),
                                                                                            }
                                                                                            : f
                                                                                    )
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setCustomFields(fields =>
                                                                            fields.map((f, i) =>
                                                                                i === idx
                                                                                    ? { ...f, options: [...(f.options || []), ''] }
                                                                                    : f
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    Add Option
                                                                </Button>
                                                            </div>
                                                        )}


                                                    </div>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setCustomFields(fields => [
                                                            ...fields,
                                                            {
                                                                id: Math.random().toString(36).slice(2),
                                                                fieldType: 'text',
                                                                labelName: '',
                                                                defaultValue: '',
                                                                options: [],
                                                                optional: false,
                                                            },
                                                        ]);
                                                        setCustomFieldErrors(errors => [
                                                            ...errors,
                                                            { labelName: false, defaultValue: false }
                                                        ]);
                                                    }}
                                                >
                                                    Add Custom Field
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-5 space-y-4">
                                        <div className="flex items-center gap-x-2 my-3">
                                            <Select defaultValue="Pay" onValueChange={c => setCta(c)}>
                                                <SelectTrigger className="w-max">
                                                    <SelectValue placeholder="Select a call to action..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="Pay">Pay</SelectItem>
                                                        <SelectItem value="Checkout">Checkout</SelectItem>
                                                        <SelectItem value="Book">Book</SelectItem>
                                                        <SelectItem value="Donate">Donate</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <span className="text-sm">as the call to action</span>
                                        </div>

                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </>
                    }
                    {selectedTab === 'post-payment' &&
                        <>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Confirmation page</h3>

                                <RadioGroup
                                    value={showConfirmation ? "show" : "dont"}
                                    onValueChange={(value) => setShowConfirmation(value === "show")}
                                >
                                    <div className="flex items-start space-x-2 pb-4">
                                        <RadioGroupItem value="show" id="show" className="mt-1" />
                                        <div className="space-y-1">
                                            <Label htmlFor="show" className="font-medium">Show confirmation page</Label>
                                            {showConfirmation && useCustomMessage && (
                                                <div className="mt-2">
                                                    <Textarea
                                                        placeholder="Include any details you see fit, such as delivery information."
                                                        className={`w-full ${hasError ? 'border-red-500' : ''}`}
                                                        value={customMessage}
                                                        onChange={(e) => setCustomMessage(e.target.value)}
                                                    />

                                                    <div className="flex justify-between items-center mt-2">
                                                        {hasError && (
                                                            <div className="flex items-start space-x-2 text-red-500 text-sm">
                                                                <AlertTriangle className="h-4 w-4 mt-0.5" />
                                                                <span>{errorMessage}</span>
                                                            </div>
                                                        )}
                                                        {/* <div className="flex ml-auto space-x-2">
                                                            <Button variant="outline" size="icon" className="h-6 w-6">
                                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                            <Button variant="outline" size="icon" className="h-6 w-6">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </Button>
                                                        </div> */}
                                                    </div>

                                                    <p className="text-gray-500 text-xs flex items-center mt-1">
                                                        <Info className="h-4 w-4 mr-1" />
                                                        Please note that custom messages aren't translated based on your customer's location.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1 ml-5">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id="custom-message"
                                                checked={useCustomMessage}
                                                onCheckedChange={(checked) => setUseCustomMessage(checked === true)}
                                                disabled={!showConfirmation}
                                                className="mt-1"
                                            />
                                            <div>
                                                <Label
                                                    htmlFor="custom-message"
                                                    className={`font-medium ${!showConfirmation ? 'text-gray-400' : ''}`}
                                                >
                                                    Replace default with custom message
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`flex items-start space-x-2 border-t ${/*border-b*/""} pt-4 pb-4`}>
                                        <RadioGroupItem value="dont" id="dont" className="mt-1" />
                                        <div className="space-y-1 w-full">
                                            <Label htmlFor="dont" className="font-medium">Don't show confirmation page</Label>
                                            <p className="text-sm text-gray-500">Redirect customers to your website.</p>
                                            {!showConfirmation && (
                                                <Input
                                                    placeholder="https://yourwebsite.com/thankyou"
                                                    className={`mt-2 max-w-md ${urlError ? 'border-red-500' : ''}`}
                                                    type="url"
                                                    value={redirectUrl}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setRedirectUrl(value);
                                                        if (!validateUrl(value)) {
                                                            setUrlError('Please enter a valid URL.');
                                                        } else {
                                                            setUrlError('');
                                                        }
                                                    }}
                                                />
                                            )}
                                            {urlError && <span className="text-red-500 text-sm">{urlError}</span>}
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Post-payment Invoice Options */}
                            {/* <div className="space-y-4 pt-6"> */}
                            {/* <h3 className="text-lg font-medium">Post-payment invoice</h3> */}

                            {/* <div className="flex items-start space-x-2 ml-5">
                                    <Checkbox
                                        id="create-invoice"
                                        checked={createInvoice}
                                        onCheckedChange={(checked) => setCreateInvoice(checked === true)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <Label htmlFor="create-invoice" className="font-medium">Create an invoice PDF</Label>
                                    </div>
                                </div> */}

                            {/* Invoice information */}
                            {/* <div className="mt-4 text-sm text-gray-600"> */}
                            {/* <p>
                                        Post-payment invoices provide more information than a regular receipt. If you want to send a regular receipt, you can choose to email customers about successful payments in
                                        <a href="#" className="text-violet-600 mx-1">email settings</a>.
                                        Configure your invoice, including adding a memo, footer, and your tax ID in
                                        <a href="#" className="text-violet-600 mx-1">invoice template settings</a>.
                                    </p> */}
                            {/* </div> */}
                            {/* </div> */}

                        </>}
                </div>
                {selectedTab === "payment" ?
                    <PaymentLinkPreview merchantName={merchantName} addedItems={addedItems} currency={currency} cta={cta} customFields={customFieldsEnabled ? customFields : []} requirePhone={collectedData.requirePhone} cart={cart} setCart={setCart} cartProducts={cartProducts} totalAmount={totalAmount} />
                    :
                    <PostPaymentPagePreview useCustomPostPaymentMessage={useCustomMessage} customPostPaymentMessage={customMessage} showConfirmation={showConfirmation} merchantName={merchantName} addedItems={addedItems} currency={currency} cta={cta} customFields={customFieldsEnabled ? customFields : []} requirePhone={collectedData.requirePhone} cart={cart} cartProducts={cartProducts} totalAmount={totalAmount} />
                }

                {/* <Button onClick={() => addedItems.map(item => console.log(`Currency: ${currency} Price: ${item.price}`))}>click me</Button> */}
            </div>
        </div>
    );
}