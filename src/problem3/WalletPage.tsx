import React, { useMemo } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Missing property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props {
  children?: React.ReactNode;
  className?: string;
}

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoize priority mapping to avoid repeated calculations
  const blockchainPriorities = useMemo(
    () => ({
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    }),
    []
  );

  const getPriority = (blockchain: string): number => {
    return blockchainPriorities[blockchain as Blockchain] ?? -99;
  };

  const processedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fixed logic: filter for valid priority AND positive amount
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Fixed: return 0 for equal priorities
        return rightPriority - leftPriority;
      })
      .map(
        (balance: WalletBalance): FormattedWalletBalance => ({
          ...balance,
          formatted: balance.amount.toFixed(2), // Better formatting with 2 decimals
        })
      );
  }, [balances, blockchainPriorities]); // Removed prices from dependencies as it's not used in computation

  const rows = useMemo(() => {
    return processedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount; // Added fallback for missing prices

      return (
        <WalletRow
          key={`${balance.currency}-${balance.blockchain}`} // Better key using unique combination
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [processedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};

export default WalletPage;

// Mock components/hooks for
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;
declare const WalletRow: React.FC<{
  key: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}>;
