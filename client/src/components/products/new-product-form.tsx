"use client"

import { InfoTooltip } from "@/components/tooltips/info-tooltip";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),

    description: z.string().max(100, {
        message: "Description must be no more than 100 characters."
    }),

    amount: z.number().min(0, {
        message: "Amount must be at least 0."
    }),

    currency: z.string().min(1, {
        message: "Please select a currency."
    })
})

interface NewProductFormProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

export function NewProductForm({ open, onOpenChange }: NewProductFormProps) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            amount: 0,
            currency: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        onOpenChange(false);
        toast({
            title: "New Product Added",
            description: `${values.name} has been added to the product catalogue.`,
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
                        // Product name
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Name
                                <InfoTooltip text="The name of the product." />
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Product name" {...field} />
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

                <div>
                    <FormLabel className="flex items-center mb-2">Pricing</FormLabel>
                    <div className="flex items-center gap-x-2">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>

                                    <FormControl>
                                        <Input placeholder="Amount" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>

                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="usdc">USDC</SelectItem>
                                                    <SelectItem value="usdt">USDT</SelectItem>
                                                    <SelectItem value="eurc">EURC</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

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
                        Add product
                    </Button>
                </div>
            </form>

        </Form>
    )
}