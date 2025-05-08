import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TodaySummary from "@/components/dashboard/today-summary";
import BusinessOverview from "@/components/dashboard/business-overview";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { Link } from "wouter";
import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';

//import SupportedCryptocurrencies from "@/components/dashboard/supported-cryptocurrencies";

export default function Dashboard() {
  return (
    <div>
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your business and payments performance
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/export">
            <Button variant="outline" className="flex items-center">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Components */}
      <TodaySummary />
      <BusinessOverview />
      {/* <RecentTransactions /> */}
      {/* <SupportedCryptocurrencies /> */}
    </div>
  );
}
