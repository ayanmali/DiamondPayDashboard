import { http, createConfig } from 'wagmi'
// import { base, optimism, arbitrum, polygon } from 'wagmi/chains'
import { base, optimism, arbitrum, polygon } from 'wagmi/chains'

import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

export const config = createConfig({
  chains: [base, optimism, arbitrum, polygon], // Only include Base chain for now
  connectors: [
    metaMask({
      headless: false,
      dappMetadata: {
        name: "Plexus",
        url: "https://tryplexus.dev",
        //iconUrl: "",
      },
      logging: { developerMode: true, sdk: true } // for testing,
    }),
    coinbaseWallet({
      appName: "Plexus",
      preference: 'smartWalletOnly',
      darkMode: true,
      enableMobileWalletLink: true,
    }),
    walletConnect({ projectId, showQrModal:true, qrModalOptions: {
      themeMode: 'dark',
    } }),
  ],
  transports: {
    //[mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
  },
})