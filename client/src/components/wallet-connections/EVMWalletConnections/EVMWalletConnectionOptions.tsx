import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi'
import { config } from './config'
import { CryptoAccount } from './account'
import { WalletOptions } from './wallet-options'
import { FC } from 'react'
import { Button } from '@/components/ui/button'
//import { SendTransaction } from './send-transaction'
// import Transfer from './transfer-stablecoins'
//import ConnectButton, { AppKitProvider } from './connections'
const queryClient = new QueryClient()

const ConnectWallet: FC = () => {
  const { isConnected } = useAccount()
  if (isConnected) return <CryptoAccount /> // display the connected wallet account
  return <WalletOptions /> // display the wallet options (metamask, phantom, etc)
}

const EVMWalletConnection: FC = () => {
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <ConnectWallet />
        {/* <AppKitProvider>
          <ConnectButton />
        </AppKitProvider> */}
        
        {/* <SendTransaction /> */}
        {/* <Transfer /> */}
      </QueryClientProvider> 
    </WagmiProvider>
  )
}

export default EVMWalletConnection;