import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi'
import { config } from './config'
import { CryptoAccount } from './account'
import { WalletOptions } from './wallet-options'
import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SendTransaction } from './send-transaction'
import { PaymentLink } from '@/pages/payment-links/payment-links'
import { Invoice } from '@/pages/invoices/invoices'
import { SwapQuote } from './uniswap/pool'
import { TokenList } from './TokenList'
//import { SendTransaction } from './send-transaction'
// import Transfer from './transfer-stablecoins'
//import ConnectButton, { AppKitProvider } from './connections'
const queryClient = new QueryClient()

const ConnectWallet: FC<{ setIsConnected: (isConnected: boolean) => void, setIsMobile: (isMobile: boolean) => void }> = ({ setIsConnected, setIsMobile }) => {
  const { isConnected } = useAccount()
  if (isConnected) {
    setIsConnected(true);
    return <CryptoAccount /> 
  } // display the connected wallet account
  setIsConnected(false);
  return <WalletOptions setIsMobile={setIsMobile} /> // display the wallet options (metamask, phantom, etc)
}

const EVMWalletConnection: FC<{ paymentObject: PaymentLink | Invoice | null }> = ({ paymentObject }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <ConnectWallet setIsConnected={setIsConnected} setIsMobile={setIsMobile} />
        <SwapQuote />
        <TokenList />
        {/* <AppKitProvider>
          <ConnectButton />
        </AppKitProvider> */}

        {isConnected && <SendTransaction isMobile={isMobile} paymentObject={paymentObject} />}
        {/* <Transfer /> */}
      </QueryClientProvider> 
    </WagmiProvider>
  )
}

export default EVMWalletConnection;