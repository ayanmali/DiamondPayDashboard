// import { createAppKit } from '@reown/appkit/react'

// import { WagmiProvider } from 'wagmi'
// import { arbitrum, mainnet, base, polygon, optimism, AppKitNetwork } from '@reown/appkit/networks'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// // 0. Setup queryClient
// const queryClient = new QueryClient()

// // 1. Get projectId from https://cloud.reown.com
// const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

// // 2. Create a metadata object - optional
// const metadata = {
//     name: 'Plexus EVM Wallet Connection',
//     description: 'AppKit Example',
//     url: 'http://localhost:3000', // origin must match your domain & subdomain
//     icons: ['https://assets.reown.com/reown-profile-pic.png']
// }

// // 3. Set the networks
// //const networks: AppKitNetwork[] = [mainnet, arbitrum, base]

// // 4. Create Wagmi Adapter
// const wagmiAdapter = new WagmiAdapter({
//     networks: [mainnet, arbitrum, base, polygon, optimism],
//     projectId,
//     ssr: false
// });

// // 5. Create modal
// createAppKit({
//     adapters: [wagmiAdapter],
//     networks: [mainnet, arbitrum, base, polygon, optimism],
//     projectId,
//     metadata,
//     features: {
//         analytics: true // Optional - defaults to your Cloud configuration
//     }
// })

// export function AppKitProvider({ children }: { children: React.ReactNode }) {
//     return (
//         <WagmiProvider config= { wagmiAdapter.wagmiConfig } >
//         <QueryClientProvider client={ queryClient }> { children } </QueryClientProvider>
//             </WagmiProvider>
//   )
// }

// export default function ConnectButton() {
//     return (
//     <>
//         <appkit-button label="WalletConnect" loadingLabel="Connecting..." />
//     {/* <appkit-network-button label="WalletConnect" loadingLabel="Connecting..." /> */}
//     </>
//     )
// }
