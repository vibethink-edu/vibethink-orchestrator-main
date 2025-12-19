"use client";

import { BalanceOverview } from "./components/balance-overview";
import { TransactionHistory } from "./components/transaction-history";
import { ExchangeRates } from "./components/exchange-rates";

/**
 * Payment Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete payment management dashboard with balance tracking,
 * transaction history, exchange rates, and comprehensive
 * financial administration tools.
 * 
 * Features:
 * - Multi-currency balance overview
 * - Transaction history with filtering
 * - Real-time exchange rates
 * - Payment and withdrawal tracking
 * - Currency conversion tools
 * 
 * @route /payment-dashboard
 */

export default function PaymentDashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <BalanceOverview />
        <TransactionHistory />
      </div>
      <div className="space-y-4">
        <ExchangeRates />
      </div>
    </div>
  );
}

