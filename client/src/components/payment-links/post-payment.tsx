import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    RadioGroup,
    RadioGroupItem
} from '@/components/ui/radio-group';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    CheckCircle,
    AlertTriangle,
    AlertCircle,
    Info,
    Check,
    Smartphone,
    Monitor,
    Plus,
    DollarSign,
} from 'lucide-react';

interface PostPaymentProps {
    defaultProductName?: string;
    defaultAmount?: string;
    currency?: string;
    testMode?: boolean;
}

export default function PostPaymentConfirmation({
    defaultProductName = 'Product name',
    defaultAmount = '0.00',
    currency = 'CA$',
    testMode = true
}: PostPaymentProps) {
    // Form state
    const [showConfirmation, setShowConfirmation] = useState<boolean>(true);
    const [customMessage, setCustomMessage] = useState<string>('');
    const [useCustomMessage, setUseCustomMessage] = useState<boolean>(false);
    const [redirectUrl, setRedirectUrl] = useState<string>('');
    const [createInvoice, setCreateInvoice] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('payment');
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

    // Validate custom message when it changes
    useEffect(() => {
        if (useCustomMessage && customMessage.trim() === '') {
            setHasError(true);
            setErrorMessage('Enter a valid custom message or use the default confirmation page.');
        } else {
            setHasError(false);
            setErrorMessage('');
        }
    }, [customMessage, useCustomMessage]);

    return (
        <div className="flex flex-col space-y-4">
            {/* Header with title and create button */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-medium">Create a payment link</h1>
                </div>
                <Button variant="default" className="bg-violet-500 hover:bg-violet-600 text-white">
                    Create link <Check className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Settings */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Select type</h2>
                        <Select defaultValue="products">
                            <SelectTrigger className="w-full max-w-xs">
                                <SelectValue placeholder="Products or subscriptions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="products">Products or subscriptions</SelectItem>
                                <SelectItem value="donations">Donations</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Tabs
                            defaultValue="payment"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="inline-flex mb-4">
                                <TabsTrigger value="payment" className="rounded-md">Payment page</TabsTrigger>
                                <TabsTrigger value="after" className="rounded-md">After payment</TabsTrigger>
                            </TabsList>

                            <TabsContent value="payment" className="space-y-4">
                                {/* Payment tab content */}
                                <p className="text-gray-500">Payment settings would go here</p>
                            </TabsContent>

                            <TabsContent value="after" className="space-y-6">
                                {/* Confirmation Page Options */}
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
                                                            className={`w-full max-w-md ${hasError ? 'border-red-500' : ''}`}
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
                                                            <div className="flex ml-auto space-x-2">
                                                                <Button variant="outline" size="icon" className="h-6 w-6">
                                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                                </Button>
                                                                <Button variant="outline" size="icon" className="h-6 w-6">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-500 text-xs flex items-center mt-1">
                                                            <Info className="h-4 w-4 mr-1" />
                                                            Please note that custom messages aren't translated based on your customer's location.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1 border-t pt-4">
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

                                        <div className="flex items-start space-x-2 border-t pt-4">
                                            <RadioGroupItem value="dont" id="dont" className="mt-1" />
                                            <div className="space-y-1">
                                                <Label htmlFor="dont" className="font-medium">Don't show confirmation page</Label>
                                                <p className="text-sm text-gray-500">Redirect customers to your website.</p>
                                                {!showConfirmation && (
                                                    <Input
                                                        placeholder="https://yourwebsite.com/thankyou"
                                                        className="mt-2 max-w-md"
                                                        value={redirectUrl}
                                                        onChange={(e) => setRedirectUrl(e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Post-payment Invoice Options */}
                                <div className="space-y-4 border-t pt-6">
                                    <h3 className="text-lg font-medium">Post-payment invoice</h3>

                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="create-invoice"
                                            checked={createInvoice}
                                            onCheckedChange={(checked) => setCreateInvoice(checked === true)}
                                            className="mt-1"
                                        />
                                        <div>
                                            <Label htmlFor="create-invoice" className="font-medium">Create an invoice PDF</Label>
                                            <p className="text-sm text-gray-500">
                                                Stripe charges 0.4% of the transaction total, up to a maximum of US$2.00 per invoice.
                                                <a href="#" className="text-violet-600 ml-1">Learn more.</a>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Invoice information */}
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>
                                            Post-payment invoices provide more information than a regular receipt. If you want to send a regular receipt, you can choose to email customers about successful payments in
                                            <a href="#" className="text-violet-600 mx-1">email settings</a>.
                                            Configure your invoice, including adding a memo, footer, and your tax ID in
                                            <a href="#" className="text-violet-600 mx-1">invoice template settings</a>.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Preview</h2>
                        <div className="flex space-x-2 bg-gray-100 rounded-md p-1">
                            <Button
                                variant={previewDevice === 'mobile' ? "default" : "ghost"}
                                size="sm"
                                className={previewDevice === 'mobile' ? "bg-white shadow" : ""}
                                onClick={() => setPreviewDevice('mobile')}
                            >
                                <Smartphone className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={previewDevice === 'desktop' ? "default" : "ghost"}
                                size="sm"
                                className={previewDevice === 'desktop' ? "bg-white shadow" : ""}
                                onClick={() => setPreviewDevice('desktop')}
                            >
                                <Monitor className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className={`flex ${activeTab === 'after' ? 'justify-center' : ''}`}></div>
                </div>
            </div>
        </div>
    );
}
            