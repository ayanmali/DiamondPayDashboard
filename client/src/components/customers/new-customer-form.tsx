"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { CountryCombobox } from "./country-combobox"
import { InfoTooltip } from "../tooltips/info-tooltip"
import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"

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
    currency: z.string().optional(),
    timezone: z.string().optional(),
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
            currency: "",
            timezone: ""
        },
    })

    // watch the selected country
    const selectedCountry = form.watch("country");

    // Watch email and billingEmail fields
    const email = form.watch("email");

    // Sync billingEmail with email if checked, or clear if unchecked
    useEffect(() => {
        if (sameAsAccountEmailChecked) {
            form.setValue("billingEmail", email, { shouldValidate: true });
        } else {
            form.setValue("billingEmail", "", { shouldValidate: true });
        }
    }, [sameAsAccountEmailChecked, email, form]);

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        if (sameAsAccountEmailChecked) {
            values.billingEmail = values.email;
        }
        onOpenChange(false);
        toast({
            title: "New Customer Added",
            description: `${values.name} (${values.email}) has been added as a customer.`,
            // action: (
            //   <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            // ),
          })
        // Now values contains all the correct data
        // Send values to your backend, etc.
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
                                <InfoTooltip text="The customer's name." />
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
                                <InfoTooltip text="The email associated with this customer." />
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
                                <InfoTooltip text="A description about this customer." />
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
                    <InfoTooltip text="The email that will receive invoices and receipts." />
                </FormLabel>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="billingEmail"
                        checked={sameAsAccountEmailChecked}
                        onCheckedChange={() => setSameAsAccountEmailChecked(!sameAsAccountEmailChecked)}
                    />
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
                        name="billingEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                }

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

                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Time zone
                                <InfoTooltip text="The timezone where the customer resides in." />
                            </FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a time zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>North America</SelectLabel>
                                            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Europe & Africa</SelectLabel>
                                            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                            <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                                            <SelectItem value="west">
                                                Western European Summer Time (WEST)
                                            </SelectItem>
                                            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                                            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Asia</SelectLabel>
                                            <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                                            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                            <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                                            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                            <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                                            <SelectItem value="ist_indonesia">
                                                Indonesia Central Standard Time (WITA)
                                            </SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Australia & Pacific</SelectLabel>
                                            <SelectItem value="awst">
                                                Australian Western Standard Time (AWST)
                                            </SelectItem>
                                            <SelectItem value="acst">
                                                Australian Central Standard Time (ACST)
                                            </SelectItem>
                                            <SelectItem value="aest">
                                                Australian Eastern Standard Time (AEST)
                                            </SelectItem>
                                            <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                                            <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>South America</SelectLabel>
                                            <SelectItem value="art">Argentina Time (ART)</SelectItem>
                                            <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                                            <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                                            <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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
                            <FormLabel className="flex items-center">
                                Default currency
                                <InfoTooltip text="The default currency to receive payments in for this customer. This can be manually changed when creating an invoice to send to this customer." />
                            </FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
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


                {/* Add and cancel buttons */}
                <div className="flex items-center gap-x-5 justify-end">
                    <Button type="button" variant="outline" onClick={() => {
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
