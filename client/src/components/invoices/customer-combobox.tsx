"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Customer } from "@/pages/customers"
import { nullable } from "zod"

// const customers = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ]

interface customerComboBoxProps {
    customers: Customer[]; // the customers array
    onSelect: (customerObj: Customer | null) => void; // sets the selected customer
    setCurrency: (currency: string) => void;
}

export function CustomerCombobox({ customers, onSelect, setCurrency }: customerComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const customerOptions = customers.map(customer => ({
    value: customer.name.toLowerCase(),
    label: 
    <div className="flex items-center gap-x-5">
        {customer.name}
        <span className="text-muted-foreground">{customer.email}</span>
    </div>,
    customerObj: customer,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? customerOptions.find((customer) => customer.value === value)?.label
            : "Select customer..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search customer..." className="h-9"/>
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {customerOptions.map((customer) => (
                <CommandItem
                  key={customer.value}
                  value={customer.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? null : customer.customerObj)
                    setCurrency(customer.customerObj.defaultCurrency);
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {customer.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === customer.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
