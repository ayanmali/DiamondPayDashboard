//import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Connector, useConnect } from 'wagmi'
import PhantomIcon from '@/images/Phantom_SVG_Icon.svg'
import CoinbaseIcon from '@/images/cbw.svg'
import MetaMaskIcon from '@/images/MetaMask-icon-fox.svg'
import BraveIcon from '@/images/brave-browser-icon.svg'
import WalletConnectIcon from '@/images/WalletConnect.svg'
import { xor } from '@/lib/utils'
import { FC } from 'react'
import { TooltipContent } from '@/components/ui/tooltip'
import { TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'

export const WalletOptions: FC<{ setIsMobile: (isMobile: boolean) => void }> = ({ setIsMobile }) => {
  const { connectors, connect, isPending } = useConnect()

  function getConnectorIcon(connector: Connector) {
    switch (connector.name.toLowerCase()) {
      case 'metamask':
        return <img src={MetaMaskIcon} alt="MetaMask" className="w-6 h-6 align-middle" />
      case 'coinbase wallet':
        return <img src={CoinbaseIcon} alt="Coinbase" className="w-8 h-8 align-middle" />
      case 'walletconnect':
        return <img src={WalletConnectIcon} alt="WalletConnect" className="w-7 h-7 align-middle" />
      case 'brave wallet':
        return <img src={BraveIcon} alt="Brave Wallet" className="w-6 h-6 align-middle" />
      case 'phantom':
        return <img src={PhantomIcon} alt="Phantom" className="w-10 h-10 align-middle" />
      default:
        return null
    }
  }

  return (
    <div>
      {/* change grid columns depending on the number of connectors there are (including phantom and brave) */}
      <div className={`grid-cols-${xor(window.ethereum && navigator.brave?.isBrave(), window.phantom) ? "3" : "2"} grid flex-col gap-4 items-center`}>
        {connectors.filter(connector => connector.name.toLowerCase() !== 'walletconnect').map((connector) => (
          <div key={connector.uid} className="flex items-center gap-2 justify-center">
            <Button className="w-full" variant="ghost" onClick={() => connect({ connector })}>
              {getConnectorIcon(connector)}
              {connector.name}
            </Button>
          </div>
        ))}
      </div>

      <div className='flex-col items-center grid grid-cols-9'>
        <div className='border border-t my-8 w-full'></div>
        <div className='border border-t my-8 w-full'></div>
        <div className='border border-t my-8 w-full'></div>
        <div className='border border-t my-8 w-full'></div>
        <div className='text-center text-muted-foreground'>or</div>
        <div className='border border-t my-8 w-full'></div>
        <div className='border border-t my-8 w-full'></div>
        <div className='border border-t my-8 w-full'></div>
        <div className='border border-t my-8 w-full'></div>
      </div>


      <div className="grid-cols-1 grid flex-col gap-4 items-center">
        {connectors.filter(connector => connector.name.toLowerCase() === 'walletconnect').map((connector) => (
          <div key={connector.uid} className="flex items-center gap-2 justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-full" variant="ghost" onClick={() => {
                    setIsMobile(true);
                    connect({ connector })
                  }}>
                    {getConnectorIcon(connector)}
                    Connect with QR Code
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open your wallet app of choice on your phone and scan the QR code shown</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      <div>
        {isPending && <p>Connecting...</p>} {/* Displaying a message  */}
      </div>
    </div>
  )
}