import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Customer } from "@/pages/customers";
import { ArrowUpDown, CopyIcon, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency, formatDate, truncateAddress } from "@/lib/utils";
import { SiEthereum } from "react-icons/si";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { EditDescriptionForm } from "./EditDescription";
import { ViewAllPaymentMethodsData } from "./all-payment-methods";

// Create a context for customer dialogs
interface CustomerDialogsContextType {
    editDescDialogOpen: boolean;
    setEditDescDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    paymentMethodsDialogOpen: boolean;
    setPaymentMethodsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentCustomer: Customer | null;
    setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
}

// Table columns
export const createColumns = (dialogContext: CustomerDialogsContextType): ColumnDef<Customer>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "joinedDate",
      header: "Joined Date",
      cell: ({ row }) => (
        <div className="capitalize">{formatDate(row.getValue("joinedDate"))}</div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2 truncate">
          <SiEthereum />
          {truncateAddress(row.getValue("paymentMethod"))}
          <Button variant="ghost" size="icon" className="ml-1" onClick={() => navigator.clipboard.writeText(row.getValue("paymentMethod"))}>
            <CopyIcon className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "totalSpent",
      header: "Total Spent",
      cell: ({ row }) => (
        <div className="capitalize font-medium">{formatCurrency(row.getValue("totalSpent"), "USD")}</div>
      ),
    },
    {
      accessorKey: "orders",
      header: "Orders",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("orders")}</div>
      ),
    },
    {
      accessorKey: "lastPaymentDate",
      header: "Last Payment Date",
      cell: ({ row }) => (
        <div className="capitalize">{formatDate(row.getValue("lastPaymentDate"))}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="">{row.getValue("description")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original
        const {
          editDescDialogOpen,
          setEditDescDialogOpen,
          paymentMethodsDialogOpen,
          setPaymentMethodsDialogOpen,
          currentCustomer,
          setCurrentCustomer
        } = dialogContext;
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.id)}
              >
                Copy payment ID
              </DropdownMenuItem> */}
  
              <DropdownMenuItem>Create invoice</DropdownMenuItem>
              {/* <DropdownMenuItem>Create subscription</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault(); // Prevent dropdown from closing dialog immediately
                setCurrentCustomer(customer);
                setPaymentMethodsDialogOpen(true);
              }}>
                View payment methods
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault(); // Prevent dropdown from closing dialog immediately
                setCurrentCustomer(customer);
                setEditDescDialogOpen(true);
              }}>
                Edit description
              </DropdownMenuItem>
            </DropdownMenuContent>
            {/* Edit Customer Description Dialog */}
            <Dialog open={editDescDialogOpen} onOpenChange={setEditDescDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit customer description</DialogTitle>
                  <div className="flex items-center gap-x-10">
                    <DialogTitle className="text-md">
                      {currentCustomer?.name}
                    </DialogTitle>
                    <DialogTitle className="text-sm font-normal text-muted-foreground">
                      {currentCustomer?.email}
                    </DialogTitle>
                  </div>
  
                  <DialogDescription className="pt-5">
                    <EditDescriptionForm onSuccessfulSubmit={() => setEditDescDialogOpen(false)}
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* All Customer Payment Methods Dialog */}
            <Dialog open={paymentMethodsDialogOpen} onOpenChange={setPaymentMethodsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>View all payment methods</DialogTitle>
                  <div className="flex items-center gap-x-10">
                    <DialogTitle className="text-md">
                      {currentCustomer?.name}
                    </DialogTitle>
                    <DialogTitle className="text-sm font-normal text-muted-foreground">
                      {currentCustomer?.email}
                    </DialogTitle>
                  </div>
                  
                  {/* <DialogDescription className="pt-5">
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription> */}
                  <ViewAllPaymentMethodsData customerId={customer.id}/>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DropdownMenu>
        )
      },
    },
  ]