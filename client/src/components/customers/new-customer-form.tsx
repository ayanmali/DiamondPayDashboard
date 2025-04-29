"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { addNewCustomerProps } from "./add-new-customer"
import { Checkbox } from "../ui/checkbox"
import { useState } from "react"
import { boolean } from "drizzle-orm/mysql-core"
import { Select } from "../ui/select"
import { CountryCombobox } from "./country-combobox"
import { InfoTooltip } from "../tooltips/info-tooltip"
import { Info } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Must be a valid email."
    }),
    description: z.string().max(100, {
        message: "Description must be no more than 100 characters."
    }),
    billingEmail: z.string().email({
        message: "Must be a valid email."
    }),
    country: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    currency: z.string().optional()
})

interface newCustomerFormProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    sameAsAccountEmailChecked: boolean;
    setSameAsAccountEmailChecked: (value: boolean) => void;
}

export function NewCustomerForm({ open, onOpenChange, sameAsAccountEmailChecked, setSameAsAccountEmailChecked }: newCustomerFormProps) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            description: "",
            billingEmail: "",
            country: "",
            addressLine1: "",
            addressLine2: "",
            postalCode: "",
            city: "",
            currency: ""
        },
    })

    // watch the selected country
    const selectedCountry = form.watch("country");

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        //console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="name"

                    render={({ field }) => (
                        // Customer name
                        <FormItem>
                            <h1 className="pb-5">General</h1>
                            <FormLabel className="flex items-center">
                                Name
                                <InfoTooltip text="The customer's name."/>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field} />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="email"

                    render={({ field }) => (
                        // Customer name
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Account email
                                <InfoTooltip text="The email associated with this customer."/>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="description"

                    render={({ field }) => (
                        // Customer name
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Description
                                <InfoTooltip text="A description about this customer."/>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Description" {...field} />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <h1 className="pb-5">Billing Information</h1>

                <FormLabel className="flex items-center">
                    Billing email
                    <InfoTooltip text="The email that will receive invoices and receipts."/>
                </FormLabel>

                <div className="flex items-center space-x-2">
                    <Checkbox id="billingEmail" checked={sameAsAccountEmailChecked} onCheckedChange={() => { setSameAsAccountEmailChecked(!sameAsAccountEmailChecked) }} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Same as account email
                    </label>
                </div>
                {!sameAsAccountEmailChecked &&
                    <FormField
                        control={form.control}
                        name="email"

                        render={({ field }) => (
                            // Customer name
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>

                        )}
                    />
                }

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Country
                                <InfoTooltip text="The country where the customer resides or operates from."/>
                            </FormLabel>
                            <FormControl>
                                <CountryCombobox
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* only show address inputs once a country is selected */}
                {selectedCountry && (
                    <>
                        <h2 className="pt-4 text-md font-medium">Billing Address</h2>
                        <FormField
                            control={form.control}
                            name="addressLine1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address line 1</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Address line 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="addressLine2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address line 2</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Address line 2" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Postal code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}


                {/* Add and cancel buttons */}
                <div className="flex items-center gap-x-5 justify-end">
                    <Button type="button" variant="secondary" onClick={() => {
                        onOpenChange(false);
                        // setEnteredWalletName("");
                        // setChainOption("");
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">Add customer</Button>
                </div>
            </form>

        </Form>
    )
}
