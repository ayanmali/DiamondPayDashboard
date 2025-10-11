// src/components/PaymentSwapForm.tsx
import React, { useState, useEffect, useMemo, FC } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import ERC20Abi from '@/erc20.json'; // ABI for standard ERC-20 functions (approve, allowance)
import { Token } from '@/pages/wallets';
import { Select, SelectValue, SelectTrigger, SelectLabel, SelectGroup, SelectContent, SelectItem } from '@/components/ui/select';

interface TokenSelectProps {
  tokens: Token[];
  selectedToken: Token;
  onSelect: (tokenName: string) => void;
  label: string;
}

const TokenSelect: FC<TokenSelectProps> = ({ tokens, selectedToken, onSelect, label }) => {
  return (
    <Select value={selectedToken.ticker} onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a token" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {tokens.map(t => (
                <SelectItem key={t.ticker} value={t.ticker}>{t.name}</SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const TOKENS: Token[] = [
  {
    name: "USDC",
    ticker: "USDC",
    chain: "Base",
    address: "0x123456789",
    decimals: 6
  },
  {
    name: "EURC",
    ticker: "EURC",
    chain: "Base",
    address: "0x123456789",
    decimals: 6
  },
  {
    name: "Wrapped Ether",
    ticker: "WETH",
    chain: "Base",
    address: "0x123456789",
    decimals: 18
  },
  {
    name: "USDT",
    ticker: "USDT",
    chain: "Base",
    address: "0x123456789",
    decimals: 6
  },
]
// Replace with the actual 1inch router address for your chain (e.g., Ethereum Mainnet)
// You can find this in 1inch API docs or their SDK
const UNISWAP_ROUTER_ADDRESS = '0x6fF5693b99212Da76ad316178A184AB56D299b43';

interface PaymentSwapFormProps {
  recipientAddress: `0x${string}`;
  desiredRecipientToken: Token; // USDC in your example
}

const PaymentSwapForm: React.FC<PaymentSwapFormProps> = ({ recipientAddress, desiredRecipientToken }) => {
  const { address: customerAddress, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [inputToken, setInputToken] = useState<Token | undefined>(TOKENS[1]); // Default to EURC
  const [inputAmount, setInputAmount] = useState<string>('');
  const [outputAmount, setOutputAmount] = useState<string>('');
  const [swapTxData, setSwapTxData] = useState<any | null>(null);
  const [approvalNeeded, setApprovalNeeded] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();

  const { writeContract: writeApproval, data: approvalHash, isPending: isApproving } = useWriteContract();
  const { writeContract: writeSwap, data: swapHash, isPending: isSwapping } = useWriteContract();

  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });
  const { isLoading: isSwapConfirming, isSuccess: isSwapConfirmed } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  const handleTokenSelect = (tokenName: string) => {
    setInputToken(TOKENS.find(t => t.ticker === tokenName));
  }

  // Fetch quote and check allowance when inputs change
  useEffect(() => {
    const fetchSwapQuote = async () => {
      if (!inputToken || !inputAmount || !customerAddress || !publicClient || !desiredRecipientToken) {
        setOutputAmount('');
        setApprovalNeeded(false);
        setSwapTxData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const amountInWei = parseUnits(inputAmount, inputToken.decimals).toString();

        // 1. Get swap quote from uniswap API
        // Replace '1' with the actual chain ID (e.g., 1 for Ethereum Mainnet, 137 for Polygon)
        const quoteResponse = await fetch(
          `https://api.1inch.dev/swap/v6.0/${publicClient.chain?.id}/quote?` +
            `fromTokenAddress=${inputToken.address}` +
            `&toTokenAddress=${desiredRecipientToken.address}` +
            `&amount=${amountInWei}` +
            `&fromAddress=${customerAddress}` + // Important for accurate gas estimation and personalized routing
            `&slippage=1` // 1% slippage tolerance, adjust as needed
        );
        const quoteData = await quoteResponse.json();

        if (quoteData.error) {
          throw new Error(quoteData.description || 'Failed to get swap quote from 1inch.');
        }

        setOutputAmount(formatUnits(quoteData.toTokenAmount, desiredRecipientToken.decimals));

        // 2. Check ERC-20 allowance
        const currentAllowance = await publicClient.readContract({
          address: inputToken.address,
          abi: ERC20Abi,
          functionName: 'allowance',
          args: [customerAddress, UNISWAP_ROUTER_ADDRESS],
        }) as bigint;

        // If current allowance is less than the amount to be swapped
        if (currentAllowance < BigInt(amountInWei)) {
          setApprovalNeeded(true);
        } else {
          setApprovalNeeded(false);
        }

        // 3. Get transaction data for the swap from 1inch API
        const swapResponse = await fetch(
          `https://api.1inch.dev/swap/v6.0/${publicClient.chain?.id}/swap?` +
            `fromTokenAddress=${inputToken.address}` +
            `&toTokenAddress=${desiredRecipientToken.address}` +
            `&amount=${amountInWei}` +
            `&fromAddress=${customerAddress}` +
            `&receiver=${recipientAddress}` + // This is crucial: recipient receives the swapped tokens
            `&slippage=1` // Same slippage as in quote
        );
        const swapData = await swapResponse.json();

        if (swapData.error) {
          throw new Error(swapData.description || 'Failed to get swap transaction data from 1inch.');
        }

        setSwapTxData(swapData.tx); // This will contain to, data, value, gasPrice, etc.

      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching swap data.');
        setOutputAmount('');
        setApprovalNeeded(false);
        setSwapTxData(null);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSwapQuote();
    }, 500); // Debounce API calls

    return () => clearTimeout(delayDebounceFn);
  }, [inputToken, inputAmount, customerAddress, publicClient, desiredRecipientToken]);

  // Handle approval confirmation
  useEffect(() => {
    if (isApprovalConfirmed) {
      setApprovalNeeded(false); // Approval is confirmed, user can now proceed to swap
      setError(null);
    }
  }, [isApprovalConfirmed]);

  // Handle swap confirmation
  useEffect(() => {
    if (isSwapConfirmed) {
      setTransactionHash(swapHash);
      setInputAmount(''); // Clear input after successful swap
      setOutputAmount('');
      setError(null);
    }
  }, [isSwapConfirmed, swapHash]);

  const handleApprove = async () => {
    if (!inputToken || !customerAddress) {
      setError("Missing token or address for approval.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amountToApprove = parseUnits(inputAmount, inputToken.decimals);

      // Prepare the approval transaction
      writeApproval({
        address: inputToken.address,
        abi: ERC20Abi,
        functionName: 'approve',
        args: [UNISWAP_ROUTER_ADDRESS, amountToApprove],
        // You might want to add gas and gasPrice if the API provides it,
        // or rely on wallet estimation.
      });
    } catch (err: any) {
      setError(err.message || 'Failed to prepare approval transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!swapTxData || !customerAddress) {
      setError("Missing swap transaction data or customer address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      writeSwap({
        address: swapTxData.to, // The 1inch router address
        abi: [], // No specific ABI needed if `useSendTransaction` is used, but `useWriteContract` expects an ABI.
                 // For `useWriteContract`, you'd need the 1inch router ABI and the specific function name.
                 // A common approach with 1inch is to directly use the returned `data` field
                 // with `useSendTransaction` for flexibility.
                 // If using `useWriteContract`, you'd need to parse the `swapTxData.data` to
                 // extract the function name and args.
                 // For simplicity here, we'll treat it as a generic transaction if ABI is not available for router
                 // Or, you can use `useSendTransaction` for a generic call if the aggregator returns
                 // full transaction data.
                 // Let's adjust to use `useSendTransaction` for clarity on aggregator output.
        functionName: '', // Empty if using `useSendTransaction` with direct data
        args: [], // Empty if using `useSendTransaction` with direct data
        data: swapTxData.data as `0x${string}`, // The actual call data for the swap
        value: BigInt(swapTxData.value), // Amount of native token (e.g., ETH) if any
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send swap transaction.');
    } finally {
      setLoading(false);
    }
  };

  // For direct `useSendTransaction` instead of `useWriteContract` for the swap.
  // This is often more suitable for aggregator APIs that return raw transaction data.
  // import { useSendTransaction } from 'wagmi';
  // const { sendTransaction, data: swapHash, isPending: isSwapping } = useSendTransaction();
  // ...
  // const handleSwap = async () => {
  //   if (!swapTxData || !customerAddress) {
  //     setError("Missing swap transaction data or customer address.");
  //     return;
  //   }
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     sendTransaction({
  //       to: swapTxData.to,
  //       data: swapTxData.data,
  //       value: BigInt(swapTxData.value || '0'), // Ensure value is BigInt and defaults to 0
  //       gas: BigInt(swapTxData.gas || '0'), // Optional: use gas from 1inch for more precise estimation
  //     });
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to send swap transaction.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  return (
    <div>
      <h2>Make a Payment (Swap Tokens)</h2>
      {!isConnected ? (
        <p>Please connect your wallet to make a payment.</p>
      ) : (
        <>
          <div>
            <p>Recipient Address: {recipientAddress}</p>
            <p>Recipient will receive: {desiredRecipientToken.ticker}</p>
          </div>

          <div>
            <TokenSelect
              tokens={Object.values(TOKENS)}
              selectedToken={inputToken as Token}
              onSelect={handleTokenSelect}
              label="Pay With"
            />
          </div>

          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="any"
              disabled={loading || isApproving || isSwapping || isApprovalConfirming || isSwapConfirming}
            />
          </div>

          {loading && <p>Loading swap data...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          {outputAmount && (
            <p>
              You will send {inputAmount} {inputToken?.ticker} to receive approximately{' '}
              <strong>{outputAmount} {desiredRecipientToken.ticker}</strong> for the recipient.
            </p>
          )}

          {inputToken && inputAmount && (
            <>
              {approvalNeeded && (
                <button
                  onClick={handleApprove}
                  disabled={isApproving || isApprovalConfirming || !inputToken || !inputAmount}
                >
                  {isApproving || isApprovalConfirming ? 'Approving...' : `Approve ${inputToken.ticker}`}
                </button>
              )}

              <button
                onClick={handleSwap}
                disabled={!swapTxData || approvalNeeded || isSwapping || isSwapConfirming}
              >
                {isSwapping || isSwapConfirming ? 'Swapping...' : 'Send Payment'}
              </button>
            </>
          )}

          {approvalHash && (
            <p>
              Approval Transaction: <a href={`https://etherscan.io/tx/${approvalHash}`} target="_blank" rel="noopener noreferrer">{approvalHash}</a>
              {isApprovalConfirming && ' (Waiting for confirmation...)'}
              {isApprovalConfirmed && ' (Confirmed!)'}
            </p>
          )}

          {swapHash && (
            <p>
              Swap Transaction: <a href={`https://etherscan.io/tx/${swapHash}`} target="_blank" rel="noopener noreferrer">{swapHash}</a>
              {isSwapConfirming && ' (Waiting for confirmation...)'}
              {isSwapConfirmed && ' (Confirmed!)'}
            </p>
          )}
          {transactionHash && isSwapConfirmed && (
            <p style={{ color: 'green' }}>Payment Successful! Recipient received {outputAmount} {desiredRecipientToken.ticker}.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentSwapForm;