import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { Plus, Phone, Smartphone, Monitor, User } from 'lucide-react';
import { FaExternalLinkAlt } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { AddedItem, CustomField } from '@/pages/payment-links/new-payment-link';
import { formatCryptoAmount } from '@/lib/utils';

// Define types for our component
// export interface CheckoutProduct {
//   product: Product
//   isMain?: boolean;
//   allowQuantity?: boolean;
// }

interface PaymentLinkPreviewProps {
    showConfirmation: boolean
    merchantName?: string;
    addedItems: AddedItem[];
    currency?: string;
    cta?: string;
    customFields?: CustomField[];
    requirePhone?: boolean;
    useCustomPostPaymentMessage: boolean
    customPostPaymentMessage: string
    cart: CartItem[]
    cartProducts: AddedItem[]
    totalAmount: string
}

type CartItem = {
    addedItem: AddedItem
    quantity: number
}

export default function PostPaymentPagePreview({
    showConfirmation = false,
    merchantName = '',
    currency = '',
    useCustomPostPaymentMessage = false,
    customPostPaymentMessage = "",
    cart,
    cartProducts,
    totalAmount
}: PaymentLinkPreviewProps) {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay'>('card');
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

    return showConfirmation ?
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl mx-auto">
            {/* Preview Panel */}
            <div className="w-full pr-5 pl-5 pb-5">
                <Card className="overflow-hidden">
                    <div className="p-6 bg-white border rounded-lg shadow">
                        <div className="flex flex-col h-full">
                            {/* Browser-like header */}
                            <div className="flex items-center justify-between mb-4 bg-gray-100 rounded p-2">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                </div>
                                <div className="text-xs text-gray-600 flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    buy.tryplexus.dev
                                </div>
                                <button className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                    Use your domain
                                </button>
                            </div>

                            {/* Payment Preview Content */}
                            <div className="flex">
                                {/* Left Panel */}
                                <div className="bg-slate-700 text-white p-6 rounded-lg w-full">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <div className="text-xs text-gray-400 pb-3">SECURE</div>
                                    </div>

                                    {merchantName && (
                                        <div className="text-gray-300 mb-1">{merchantName}</div>
                                    )}

                                    {/* Total Amount */}
                                    <div className="text-4xl font-bold mb-6">{totalAmount}</div>

                                    {/* Cart Items */}
                                    <div className="space-y-4">
                                        {cartProducts.map((addedItem) => {
                                            const cartItem = cart.find(item => item.addedItem.product.id === addedItem.product.id);
                                            const quantity = cartItem ? cartItem.quantity : 0;
                                            const totalPrice = addedItem.price * quantity;

                                            return (
                                                <div key={addedItem.product.id} className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-gray-300">{addedItem.product.name}</div>
                                                        {quantity > 1 && (
                                                            <div className="flex items-center text-sm">
                                                                <div className="text-gray-400">
                                                                    Qty {quantity} -
                                                                </div>
                                                                <div className="text-gray-400 ml-1">
                                                                    {formatCryptoAmount(addedItem.price, currency)} each
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">{formatCryptoAmount(totalPrice, currency)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>


                                </div>
                            </div>
                        </div>

                        <Card className="p-6">
                            <div className="flex flex-col space-y-6">
                                {/* Payment Methods */}
                                {(
                                    <>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between mb-4">
                                                    {/* Payment methods */}
                                                    {/* <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="flex items-center justify-center border bg-white hover:bg-gray-50 text-black"
                              onClick={() => setPaymentMethod('card')}
                            >
                              <CreditCard className="h-5 w-5 mr-2" />
                              Card
                            </Button>
                            <Button
                              variant="outline"
                              className="flex items-center justify-center border bg-white hover:bg-gray-50 text-black"
                              onClick={() => setPaymentMethod('applepay')}
                            >
                              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none">
                                <path d="M18.5 3H5.5C4.11929 3 3 4.11929 3 5.5V18.5C3 19.8807 4.11929 21 5.5 21H18.5C19.8807 21 21 19.8807 21 18.5V5.5C21 4.11929 19.8807 3 18.5 3Z" fill="currentColor" />
                                <path d="M15.5 8.5C15.2953 8.8 14.8 9 14.5 9C14.2 9 13.7047 8.8 13.5 8.5C13.2953 8.1 13.8 7.5 14.1 7C14.4 6.5 14.7047 6.7 15 7C15.2953 7.3 15.7047 8.2 15.5 8.5Z" fill="white" />
                                <path d="M13 10C12.4 10 12 10.4 12 11V17H13V11H14V17H15V11C15 10.4 14.6 10 14 10H13Z" fill="white" />
                                <path d="M10 11C10 10.4 9.6 10 9 10H8C7.4 10 7 10.4 7 11V16C7 16.6 7.4 17 8 17H9C9.6 17 10 16.6 10 16V11ZM9 16H8V11H9V16Z" fill="white" />
                              </svg>
                              Apple Pay
                            </Button>
                          </div> */}
                                                </div>

                                                {/* Card Information */}
                                                {/* <div className="mb-4">
                          <h3 className="text-gray-700 font-medium mb-2">Card information</h3>
                          <div className="space-y-3">
                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="1234 1234 1234 1234"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <div className="flex space-x-1">
                                  <span className="text-xs text-blue-600 font-bold">VISA</span>
                                  <span className="text-xs bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold px-1 rounded">MC</span>
                                  <span className="text-xs text-blue-800 font-bold">AMEX</span>
                                  <span className="text-xs text-gray-700 font-bold">DISC</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input placeholder="MM / YY" />
                              <div className="relative">
                                <Input placeholder="CVC" />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}

                                                {/* Billing Address */}
                                                {/* <div className="mb-4">
                          <h3 className="text-gray-700 font-medium mb-2">Billing address</h3>
                          <div className="space-y-3">
                            <Select defaultValue="US">
                              <SelectTrigger>
                                <SelectValue placeholder="United States" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="Address line 1" />
                            <Input placeholder="Address line 2" />
                            <div className="grid grid-cols-2 gap-3">
                              <Input placeholder="City" />
                              <Input placeholder="ZIP" />
                            </div>
                            <Select defaultValue="">
                              <SelectTrigger>
                                <SelectValue placeholder="State" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CA">California</SelectItem>
                                <SelectItem value="NY">New York</SelectItem>
                                <SelectItem value="TX">Texas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div> */}

                                            </div>

                                            {/* Checkmark */}
                                            <div className='w-full flex items-center justify-center'>
                                                <CiCircleCheck className='text-green-400 h-20 w-20' />
                                            </div>

                                            {/* Post payment message */}
                                            <div className='text-muted-foreground w-full flex items-center justify-center'>
                                                <span className='font-medium text-lg'>{useCustomPostPaymentMessage ? customPostPaymentMessage : "Thanks for your payment"}</span>
                                            </div>

                                            <div className="border border-gray-300 rounded-lg p-4 max-w-md mx-auto">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="font-medium text-lg">{merchantName}</h2>
                                                    <span className="text-slate-800">{totalAmount}</span>
                                                </div>
                                                <hr className="my-2 border-dashed" />

                                            </div>

                                            <div className='text-muted-foreground w-full flex items-center justify-center'>
                                                <span className=''>A receipt will be sent to your email shortly.</span>
                                            </div>

                                            <div className='pt-5 text-muted-foreground w-full flex items-center justify-center'>
                                                <span className='text-center text-xs'>Powered by Plexus</span>
                                            </div>
                                            <div className='text-muted-foreground w-full flex items-center justify-center'>
                                                <span className='text-center text-xs'>Terms  Privacy</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>

                    </div>
                </Card>
            </div>

            {/* Form Panel */}

        </div>
        :
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl mx-auto">
            <div className="w-full pr-5 pl-5 pb-5 flex items-center justify-center">
                <Card className="h-dvh flex items-center justify-center w-full bg-slate-100">
                    <div className='justify-items-center pl-5 pr-5'>
                        <FaExternalLinkAlt className="h-6 w-6 mb-5" />
                        <span className='text-muted-foreground'>Your website will be shown after payment</span>
                    </div>
                </Card>
            </div>
        </div>

}