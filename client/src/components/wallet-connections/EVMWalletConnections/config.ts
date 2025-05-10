import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

export const config = createConfig({
  chains: [base], // Only include Base chain for now
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
  },
})