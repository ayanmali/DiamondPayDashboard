"use client"

import { InfoTooltip } from "@/components/tooltips/info-tooltip";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
}

export function NewWithdrawWalletForm({ open, onOpenChange }: newWithdrawWalletFormProps) {
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

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        onOpenChange(false);
        toast({
            title: "New Withdrawal Wallet Added",
            description: `The withdrawal wallet ${values.name} with address ${values.address} has been added.`,
            // action: (
            //   <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            // ),
          })
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
                    <Button type="button" variant="outline" onClick={() => {
                        onOpenChange(false);
                        // setEnteredWalletName("");
                        // setChainOption("");
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Add withdrawal wallet
                    </Button>
                </div>
            </form>

        </Form>
    )
}