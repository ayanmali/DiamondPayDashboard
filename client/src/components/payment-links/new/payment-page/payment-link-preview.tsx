import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { Plus, CreditCard, Info, Phone, User, XIcon } from 'lucide-react';
import { AddedItem, CustomField } from '@/pages/payment-links/new-payment-link';
import { formatCryptoAmount } from '@/lib/utils';

// Define types for our component
// export interface CheckoutProduct {
//   product: Product
//   isMain?: boolean;
//   allowQuantity?: boolean;
// }

interface PaymentLinkPreviewProps {
  merchantName?: string;
  addedItems: AddedItem[];
  currency?: string;
  cta?: string;
  customFields?: CustomField[];
  requirePhone?: boolean
}

export type CartItem = {
  addedItem: AddedItem
  quantity: number
}

export default function PaymentLinkPreview({
  merchantName = '',
  addedItems = [],
  currency = '',
  cta = 'Pay',
  customFields = [],
  requirePhone = false
}: PaymentLinkPreviewProps) {
  // const [cart, setCart] = useState<CartItem[]>(
  //   addedItems.map(addedItem => ({ addedItem: addedItem, quantity: addedItem.isMain ? addedItem.quantity : 0 }))
  // );
  const [cart, setCart] = useState<CartItem[]>(
    addedItems.filter(i => i.isMain).map(addedItem => ({ addedItem: addedItem, quantity: addedItem.quantity }))
  );

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay'>('card');

  // sync cart with addedItems
  // useEffect(() => {
  //   setCart(prevCart =>
  //     addedItems.map(addedItem => {
  //       // Try to find the item in the previous cart
  //       const existing = prevCart.find(c => c.addedItem.product.id === addedItem.product.id);
  //       // for items that are already in the cart, keep their quantities the same
  //       // else, set their quantity to 1 (for main products) or 0 (for recommended)
  //       return {
  //         addedItem,
  //         quantity: addedItem.isMain ? addedItem.quantity : 0
  //         // quantity: existing ? existing.quantity : (addedItem.isMain ? addedItem.quantity : 0),
  //       };
  //     })
  //   );
  // }, [addedItems]);

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

  // Calculate the total price based on cart quantities
  const calculateTotal = () => {
    //const mainProducts = addedItems.filter(item => item.isMain);

    return addedItems.reduce((total, item) => {
      const cartItem = cart.find(c => c.addedItem.product.id === item.product.id);
      return total + (cartItem ? cartItem.quantity * item.price : 0);
    }, 0);
  };

  // Find main product if it exists
  // const mainProduct = addedItems.find(p => p.isMain);

  // Update quantity for a product
  const updateQuantity = (addedItem: AddedItem, quantity: number) => {
    setCart(prev => prev.map(item =>
      item.addedItem.product.id === addedItem.product.id ? { ...item, quantity } : item
    ));
  };

  const removeProduct = (addedItem: AddedItem) => {
    setCart(cart.filter(i => i.addedItem.product.id !== addedItem.product.id));
  }

  // Add product to cart
  const addProduct = (addedItem: AddedItem) => {
    const existingItem = cart.find(item => item.addedItem.product.id === addedItem.product.id);
    if (existingItem) {
      updateQuantity(addedItem, existingItem.quantity + 1);
    } else {
      setCart([...cart, { addedItem: addedItem, quantity: addedItem.quantity }]);
    }
  };

  // Format price with two decimal places

  // Get products that are in the cart
  const cartProducts = addedItems.filter(addedItem =>
    cart.some(item => item.addedItem.product.id === addedItem.product.id && item.quantity > 0)
  );

  // Format the total amount
  const totalAmount = `${formatCryptoAmount(calculateTotal(), currency)}`;
  //formatPrice(calculateTotal());

  return (
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
                  buy.diamondpay.dev
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
                  <div className="space-y-5">
                    {cartProducts.filter(i => i.isMain).map((addedItem) => {
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
                            {addedItem.allowQuantityAdjustment && (
                              <div className='flex items-center text-sm mt-2'>
                                <input
                                  type="number"
                                  value={quantity}
                                  min="1"
                                  onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 1;
                                    updateQuantity(addedItem, newQuantity);
                                  }}
                                  className="w-20 border border-gray-200 rounded px-2 py-1 text-sm text-slate-700"
                                />
                                <span className="ml-2">Quantity</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">{formatCryptoAmount(totalPrice, currency)}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className='border-t border-slate-500 mt-5 mb-5'></div>

                  <div className="space-y-5 pb-5">
                    {cartProducts.filter(i => !i.isMain).map((addedItem) => {
                      const cartItem = cart.find(item => item.addedItem.product.id === addedItem.product.id);
                      const quantity = cartItem ? cartItem.quantity : 0;
                      const totalPrice = addedItem.price * quantity;

                      return (
                        <div key={addedItem.product.id} className="flex justify-between items-start">
                          <div>
                            <div className='flex items-center gap-x-4'>
                              {!addedItem.isMain &&
                                <Button variant="link" className='w-1 h-1' onClick={() => removeProduct(addedItem)}>
                                  <XIcon className='h-4 w-4 text-white'/>
                                </Button>
                              }
                              <div className="text-gray-300">{addedItem.product.name}</div>
                            </div>
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
                            {addedItem.allowQuantityAdjustment && (
                              <div className='flex items-center text-sm mt-2'>
                                <input
                                  type="number"
                                  value={quantity}
                                  min="1"
                                  onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 1;
                                    updateQuantity(addedItem, newQuantity);
                                  }}
                                  className="w-20 border border-gray-200 rounded px-2 py-1 text-sm text-slate-700"
                                />
                                <span className="ml-2">Quantity</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">{formatCryptoAmount(totalPrice, currency)}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add recommended products to order section */}
                  <div className="mt-6">
                    {addedItems.filter(item => !item.isMain).length > 0 &&
                      <h3 className="text-gray-300 mb-3">Add to your order</h3>
                    }
                    {addedItems
                      .filter(item => !item.isMain) // only taking recommended products
                      .map(item =>
                        <div key={item.product.id} className="bg-slate-600 p-4 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-white">{item.product.name}</div>
                              <div className="text-gray-400 text-sm">{item.product.description}</div>
                            </div>
                            <div>{formatCryptoAmount(item.price * item.quantity, currency)}</div>
                          </div>

                          {item.quantity > 1 && (
                            <div className="flex items-center text-sm">
                              <div className="text-gray-400">
                                Qty {item.quantity} -
                              </div>

                              <div className="text-gray-400 ml-1">
                                {formatCryptoAmount(item.price, currency)} each
                              </div>
                            </div>
                          )}

                          {!cart.map(i => i.addedItem.product.id).includes(item.product.id) &&
                            <Button
                              variant="ghost"
                              className="mt-2 text-white hover:bg-slate-500"
                              size="sm"
                              onClick={() => addProduct(item)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                          }
                        </div>
                      )}

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

                        {/* Contact Information */}

                        <div className="mb-5">
                          <h3 className="text-gray-700 font-medium mb-2">Contact information</h3>

                          <div className="space-y-4">
                            {/* Name */}
                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="Name"
                                className="pl-10"
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <User className='text-muted-foreground h-5 w-5' />

                              </div>
                            </div>

                            {/* email */}
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                className="pl-10"
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                            </div>

                            {/* phone number */}
                            {requirePhone &&
                              <div className="relative">
                                <Input
                                  type="tel"
                                  placeholder="(201) 555-0123"
                                  className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <div className="flex items-center">
                                    <span className="text-xs mr-1"><Phone className='w-4 h-4 text-muted-foreground' /></span>
                                  </div>
                                </div>

                              </div>
                            }

                          </div>
                        </div>

                        {/* Custom Label */}
                        {customFields && customFields.length > 0 && (
                          <div className="mb-4">

                            <div className="space-y-3">
                              {customFields.map(field => {
                                switch (field.fieldType) {
                                  case 'text':
                                    return (
                                      // <div>
                                      //   <div className='flex items-center justify-between'>
                                      //     <h3 className="text-gray-700 font-medium mb-2">{field.labelName}</h3>
                                      //     {field.optional && <h4 className='text-muted-foreground text-sm mb-2'>Optional</h4>}
                                      //   </div>
                                      //   <Input
                                      //     key={field.id}
                                      //     // placeholder={field.labelName}
                                      //     defaultValue={field.defaultValue}
                                      //   />

                                      // </div>
                                      <div className="relative">
                                        <h3 className="text-gray-700 font-medium mb-2">{field.labelName}</h3>
                                        <Input
                                          key={field.id}
                                          defaultValue={field.defaultValue}
                                          className=""
                                        />

                                        {
                                          field.optional &&
                                          <div className={`absolute ${field.labelName.length > 0 ? "inset-y-10 mt-3" : "inset-y-1"} right-0 flex items-center pr-3 text-sm text-muted-foreground`}>
                                            Optional
                                          </div>
                                        }
                                      </div>
                                    );
                                  case 'number':
                                    return (
                                      <div className="relative">
                                        <h3 className="text-gray-700 font-medium mb-2">{field.labelName}</h3>
                                        <Input
                                          key={field.id}
                                          type='number'
                                          defaultValue={field.defaultValue}
                                          className=""
                                        />

                                        {
                                          field.optional &&
                                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                                            Optional
                                          </div>
                                        }
                                      </div>
                                    );
                                  case 'dropdown':
                                    return (
                                      <Select key={field.id} defaultValue={field.defaultValue}>
                                        <SelectTrigger>
                                          <SelectValue placeholder={field.labelName} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {field.options?.map((opt, i) => (
                                            <SelectItem key={i} value={opt}>
                                              {opt}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    );
                                  case 'checkbox':
                                    return (
                                      <div key={field.id + (field.defaultValue === 'true' ? '-checked' : '-unchecked')} className="flex items-center gap-2 my-7">
                                        <Checkbox
                                          id={field.id}
                                          defaultChecked={field.defaultValue === 'true'}
                                        />
                                        <Label htmlFor={field.id}>{field.labelName}</Label>
                                      </div>
                                    );
                                  default:
                                    return null;
                                }
                              })}
                            </div>
                          </div>
                        )}

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

                      {/* Pay Button */}
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {cta}
                      </Button>

                      <div className='pt-5 text-muted-foreground w-full flex items-center justify-center'>
                        <span className='text-center text-xs'>Powered by DiamondPay</span>
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
  );
}