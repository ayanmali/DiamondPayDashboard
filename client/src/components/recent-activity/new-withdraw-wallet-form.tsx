"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { InfoTooltip } from "../tooltips/info-tooltip"
import { useEffect } from "react"

// Regular expressions for EVM and Solana addresses
const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// Custom validation function
const validateAddress = (address: string) => {
    return evmAddressRegex.test(address) || solanaAddressRegex.test(address);
};

// Define the schema with custom validation
const addressSchema = z.string().refine(validateAddress, {
    message: "Invalid wallet address format. Must be a valid EVM or Solana address.",
});

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),

    address: addressSchema,

    email: z.string().email({
        message: "Must be a valid email."
    }).optional(),

    description: z.string().max(100, {
        message: "Description must be no more than 100 characters."
    })
})

interface newWithdrawWalletFormProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    sameAsAccountEmailChecked: boolean;
    setSameAsAccountEmailChecked: (value: boolean) => void;
}

export function NewWithdrawWalletForm({ open, onOpenChange, sameAsAccountEmailChecked, setSameAsAccountEmailChecked }: newWithdrawWalletFormProps) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            email: "",
            description: "",
        },
    })

    // Watch email and billingEmail fields
    const email = form.watch("email");

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        onOpenChange(false);
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
                            <FormLabel className="flex items-center">
                                Name
                                <InfoTooltip text="The name of the withdrawal wallet." />
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
                    name="address"

                    render={({ field }) => (
                        // Customer name
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Wallet Address
                                <InfoTooltip text="The EVM/Solana address of the withdrawal wallet." />
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Address..." {...field} />
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
                                Email
                                <InfoTooltip text="The email associated with this withdrawal wallet. This can be used to notify receivers after transferring crypto to them." />
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
                                <InfoTooltip text="A description about this withdrawal wallet." />
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Description" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>

                    )}
                />

                {/* Form field for specifying customer country. */}
                {/* <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Country
                                <InfoTooltip text="The country where the customer resides or operates from." />
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
                /> */}
                {/* only show address inputs once a country is selected */}
                {/* {selectedCountry && (
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
                )} */}


                {/* Add and cancel buttons */}
                <div className="flex items-center gap-x-5 justify-end">
                    <Button type="button" variant="secondary" onClick={() => {
                        onOpenChange(false);
                        // setEnteredWalletName("");
                        // setChainOption("");
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">Add withdrawal wallet</Button>
                </div>
            </form>

        </Form>
    )
}
