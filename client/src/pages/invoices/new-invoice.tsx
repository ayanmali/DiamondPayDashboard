import React, { useState, ChangeEvent } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerCombobox } from "../../components/invoices/customer-combobox";
import { Customer } from "@/pages/customers/customers";
import { formatDate } from "@/lib/utils";
import { Link } from "wouter";

// Types
interface LineItem {
    desc: string;
    qty: number;
    price: number;
}

interface DueOption {
    value: string;
    label: string;
}

interface CustomFields {
    memo: string;
    footer: string;
    fields: Record<string, string>;
}

interface InvoicePreviewProps {
    customer: Customer | null;
    currency: string;
    //dueDate: DueOption;
    dateDue: Date
    items: LineItem[];
    customFields: CustomFields;
}

const todayDateStr = new Date().toISOString().split("T")[0];

const sampleCustomersData: Customer[] = [
    {
      name: "Walter",
      id: "id",
      email: "walter@heisenberg.com",
      joinedDate: new Date(2025, 1, 30),
      paymentMethod: "0x93awfegegegg42t24gf2t24t24g3rg24t4ef13r2ty35hjyk754tf5g",
      totalSpent: 911.00,
      orders: 20,
      lastPaymentDate: new Date(2025, 4, 20),
      description: "hartwell",
      defaultCurrency: "USDC"
    },
    {
      name: "Jesse",
      id: "id",
      email: "jesse@capncook.com",
      joinedDate: new Date(2025, 3, 13),
      paymentMethod: "0xA5J...9R7",
      totalSpent: 420.00,
      orders: 14,
      lastPaymentDate: new Date(2025, 3, 18),
      description: "b!tch",
      defaultCurrency: "USDC"
    },
    {
      name: "Saul",
      id: "id",
      email: "saul@sgassociates.com",
      joinedDate: new Date(2025, 2, 20),
      paymentMethod: "0xXI9...7RY",
      totalSpent: 69.00,
      orders: 4,
      lastPaymentDate: new Date(2025, 4, 25),
      description: "did you know you have rights?",
      defaultCurrency: "EURC"
    },
    {
      name: "Hank",
      id: "id",
      email: "hank@schraderbrau.com",
      joinedDate: new Date(2025, 1, 10),
      paymentMethod: "0x7U6...JF9",
      totalSpent: 100.00,
      orders: 7,
      lastPaymentDate: new Date(2025, 1, 11),
      description: "asac",
      defaultCurrency: "USDT"
    },
    {
      name: "Mike",
      id: "id",
      email: "mike@lospollos.com",
      joinedDate: new Date(2025, 2, 29),
      paymentMethod: "0xG89...0D2",
      totalSpent: 42.00,
      orders: 48,
      lastPaymentDate: new Date(2025, 4, 1),
      description: "for the chicken man",
      defaultCurrency: "EURC"
    },
  ]

// Invoice Preview Component
const InvoicePreview: React.FC<InvoicePreviewProps> = ({
    customer,
    currency,
    //dueDate,
    dateDue,
    items,
    customFields
}) => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div className="p-6 bg-white rounded shadow w-full">
            <h2 className="text-2xl font-bold mb-4">Invoice</h2>
            <div className="mb-4">
                {/* Invoice Number */}
                <div className="flex items-center gap-x-1">
                        <span className="font-semibold">Invoice number:</span>
                        <span>EXAMPLE-0001</span>
                        {/* {formatDate(new Date()) || " —"} */}
                </div>

                {/* Vendor and customer info */}
                <div className="flex justify-between mt-8">
                    {/* Vendor Info */}
                    <div className="flex flex-col space-y-1">
                        <p className="font-semibold">Vendor Name</p>
                        <p>vendor@email.com</p>
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-col space-y-1 text-right">
                        <p className="font-semibold">Bill to</p>
                        <p>{customer?.name}</p>
                        <p>{customer?.email}</p>
                    </div>
                </div>

                {/* Date issued */}
                <div className="flex items-center gap-x-1">
                    <span className="font-semibold">Date Issued:</span>
                    {formatDate(new Date()) || " —"}
                </div>

                {/* Date due */}
                <div className="flex items-center gap-x-1">
                    <span className="font-semibold">Date Due:</span>
                    {formatDate(dateDue) || " —"}
                </div>

                <div className="flex items-center gap-x-1">
                    <span className="font-semibold">Currency:</span>
                    {currency || "—"}
                </div>
                {customFields.memo && <div className="my-3">{customFields.memo}</div>}

                {Object.entries(customFields.fields).map(([key, value]) => (
                    Object.entries(customFields.fields).length > 0 && <div key={key}><strong>{key}:</strong> {value}</div>
                ))}
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="font-semibold">Description</th>
                        <th className="text-right font-semibold">Qty</th>
                        <th className="text-right font-semibold">Unit Price</th>
                        <th className="text-right font-semibold">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.desc}</td>
                            <td className="text-right">{item.qty}</td>
                            <td className="text-right">{currency} {item.price.toFixed(2)}</td>
                            <td className="text-right">{currency} {(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className="text-right font-semibold">Total</td>
                        <td className="text-right font-semibold">{currency} {total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            {customFields.footer && <div className="my-3">{customFields.footer}</div>}
        </div>
    );
};

function InvoiceHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b bg-background">
            {/* Left section with close button and title */}
            <div className="flex items-center gap-3">
                <Link href="/invoices">
                    <button className="p-2 hover:bg-gray-100 rounded-md">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </Link>
                <h1 className="text-base font-normal">Create invoice</h1>
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
                    Send invoice
                </button>
            </div>
        </header>
    );
}

// Main Invoice Page
const NewInvoicePage: React.FC = () => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [currency, setCurrency] = useState<string>("");
    const [dueOption, setDueOption] = useState<string>("");
    const [customDate, setCustomDate] = useState<string>("");
    const [items, setItems] = useState<LineItem[]>([{ desc: "", qty: 1, price: 0 }]);
    const [memo, setMemo] = useState<string>("");
    const [footer, setFooter] = useState<string>("");
    const [fields, setFields] = useState<Record<string, string>>({});

    const dueOptions: DueOption[] = [
        { value: 'today', label: 'Today' },
        { value: 'tomorrow', label: 'Tomorrow' },
        { value: '7', label: 'In 7 days' },
        { value: '14', label: 'In 14 days' },
        { value: '30', label: 'In 30 days' },
        { value: '45', label: 'In 45 days' },
        { value: '60', label: 'In 60 days' },
        { value: '90', label: 'In 90 days' },
        { value: 'custom', label: 'Custom' }
    ];

    const addItem = () => {
        setItems(prev => [...prev, { desc: "", qty: 1, price: 0 }]);
    };

    const updateItem = (index: number, key: keyof LineItem, value: string) => {
        setItems(prev => {
            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                [key]: key === 'qty' || key === 'price' ? Number(value) : value
            } as LineItem;
            return copy;
        });
    };

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const addField = () => {
        setFields(prev => ({ ...prev, '': '' }));
    };

    const updateField = (key: string, value: string) => {
        setFields(prev => ({ ...prev, [key]: value }));
    };

    const removeField = (key: string) => {
        setFields(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomDate(e.target.value);
    };

    const getDateDue = (): Date => {
        const now = new Date();
        switch (dueOption) {
            case "today":
                return now;
            case "tomorrow":
                return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            case "7":
            case "14":
            case "30":
            case "45":
            case "60":
            case "90":
                return new Date(now.getFullYear(), now.getMonth(), now.getDate() + Number(dueOption));
            case "custom":
                if (customDate) {
                    const [year, month, day] = customDate.split('-').map(Number);
                    return new Date(year, month - 1, day);
                }
                return now;
            default:
                return now;
        }
    };

    return (
        <>
        <InvoiceHeader/>
        <div className="flex gap-8 pl-5 pt-20 pr-5">
            {/* Left form */}
            <div className="w-1/2 bg-gray-50 p-6 rounded">
                <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>

                {/* Customer */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Customer</label>
                    {/* <Input
                        placeholder="Select customer"
                        value={customer}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)}
                    /> */}
                    <CustomerCombobox customers={sampleCustomersData} onSelect={setCustomer} setCurrency={setCurrency}/>

                </div>

                {/* Currency */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Currency</label>
                    <Select
                        disabled={!customer}
                        onValueChange={(v: string) => setCurrency(v)}
                        value={currency}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USDC">USDC</SelectItem>
                            <SelectItem value="USDT">USDT</SelectItem>
                            <SelectItem value="EURC">EURC</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Due Date */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Due Date</label>
                    <Select
                        onValueChange={(v: string) => setDueOption(v)}
                        value={dueOption}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select due" />
                        </SelectTrigger>
                        <SelectContent>
                            {dueOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {dueOption === 'custom' && (
                        <div className="mt-2">
                            <Input
                                type="date"
                                min={todayDateStr}
                                value={customDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    )}
                </div>

                {/* Line Items */}
                <div className="mb-4">
                    <h2 className="font-medium mb-2">Line Items</h2>
                    {/* column of labels */}
                    {
                        items.length > 0 &&
                        <div className="grid grid-cols-4 gap-4">
                            <label htmlFor={`description-0`} className="block text-sm font-medium text-gray-600">
                                Description
                            </label>
                            <label htmlFor={`quantity-0`} className="block text-sm font-medium text-gray-600">
                                Qty
                            </label>
                            <label htmlFor={`unitPrice-0`} className="block text-sm font-medium text-gray-600">
                                Unit price
                            </label>
                            <span /> {/* Empty for alignment with remove button */}
                        </div>
                    }

                    {/* inputs row */}
                    {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-4 items-center pt-2 pb-2">
                            {/* Description */}
                            <div>
                                <input
                                    id={`description-${idx}`}
                                    type="text"
                                    value={item.desc}
                                    onChange={e => updateItem(idx, "desc", e.target.value)}
                                    placeholder="Description"
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* Quantity */}
                            <div>
                                <input
                                    id={`quantity-${idx}`}
                                    type="number"
                                    min={0}
                                    value={item.qty}
                                    onChange={e => updateItem(idx, "qty", e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* Unit Price */}
                            <div>
                                <input
                                    id={`unitPrice-${idx}`}
                                    type="number"
                                    min={0}
                                    value={item.price}
                                    onChange={e => updateItem(idx, "price", e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* Remove button */}
                            <div className="flex justify-end">
                                <Button variant="ghost" onClick={() => removeItem(idx)}>✕</Button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                    >
                        Add line item
                    </button>
                </div>

                {/* Custom Fields */}
                <div className="mb-4">
                    <h2 className="font-medium mb-2">Custom Fields</h2>
                    {/* <Checkbox checked onCheckedChange={() => { }} className="mb-2">Memo</Checkbox> */}
                    <Input
                        placeholder="Memo"
                        value={memo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMemo(e.target.value)}
                        className="mb-2"
                    />

                    {/* <Checkbox checked onCheckedChange={() => { }} className="mb-2">Footer</Checkbox> */}
                    <Input
                        placeholder="Footer"
                        value={footer}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFooter(e.target.value)}
                        className="mb-2"
                    />

                    {Object.entries(fields).map(([key, val], i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <Input
                                placeholder="Key"
                                value={key}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const newKey = e.target.value;
                                    const newFields = { ...fields };
                                    delete newFields[key];
                                    newFields[newKey] = val;
                                    setFields(newFields);
                                }}
                            />
                            <Input
                                placeholder="Value"
                                value={val}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField(key, e.target.value)}
                            />
                            <Button variant="ghost" onClick={() => removeField(key)}>✕</Button>
                        </div>
                    ))}
                    <Button onClick={addField} variant="link" className="mt-2">
                        Add custom field
                    </Button>
                </div>

                {/* Save */}
                <Button className="w-full mt-4">Send invoice</Button>
            </div>

            {/* Preview */}
            <div className="w-1/2">
                <InvoicePreview
                    customer={customer}
                    currency={currency}
                    //dueDate={dueOptions.find(o => o.value === dueOption) || { value: '', label: '' }}
                    dateDue={getDateDue()}
                    items={items}
                    customFields={{ memo, footer, fields }}
                />
            </div>
        </div>
        </>
    );
};

export default NewInvoicePage;