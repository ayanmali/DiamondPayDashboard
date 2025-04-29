import { SiEthereum } from "react-icons/si";
import { CopyIcon } from "lucide-react";
import { formatDate, truncateAddress } from "@/lib/utils";
import { DialogDescription } from "../ui/dialog";
import { UUID } from "crypto";

const walletsData = [
  {
    walletAddress: "0x2g22tt2t",
    lastPaid: new Date(2025, 4, 1),
  },
  {
    walletAddress: "0xfjf93d9",
    lastPaid: new Date(2025, 3, 5),
  },
  {
    walletAddress: "0xkd92md0",
    lastPaid: new Date(2025, 4, 10),
  },
];

interface customerProps {
    customerId: string;
}

export function ViewAllPaymentMethodsData({ customerId }: customerProps) {
  return (
    <DialogDescription className="pt-5">
      <div className="grid gap-y-3">
        {/* Header labels */}
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-semibold uppercase text-muted-foreground">
            Wallet Address
          </div>
          <div className="text-xs font-semibold uppercase text-muted-foreground">
            Last Used
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-muted-foreground opacity-20" />

        {/* Wallet data */}
        {walletsData.map((wallet, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-x-2">
              <SiEthereum className="text-muted-foreground" />
              <span>{truncateAddress(wallet.walletAddress)}</span>
              <CopyIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </div>
            <span className="text-muted-foreground text-sm">
              {formatDate(wallet.lastPaid)}
            </span>
          </div>
        ))}
      </div>
    </DialogDescription>
  );
}
