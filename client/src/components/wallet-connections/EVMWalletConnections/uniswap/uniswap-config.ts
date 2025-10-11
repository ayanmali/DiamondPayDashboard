import { Token as UniswapToken } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';
import { USDC_TOKEN, WETH_TOKEN } from './constants';

// Inputs that configure this example to run
export interface ExampleConfig {
    rpc: {
        local: string
        mainnet: string
        baseSepolia: string
        base: string
        polygon: string
    }
    tokens: {
        in: UniswapToken
        amountIn: number
        out: UniswapToken
        poolFee: number
    }
}

// Example Configuration

function createSwapConfig(inToken: UniswapToken, outToken: UniswapToken, amountIn: number, poolFee: FeeAmount): ExampleConfig {
    return {
        rpc: {
            local: '',
            mainnet: '',
            baseSepolia: import.meta.env.VITE_BASE_SEPOLIA_RPC_URL,
            base: import.meta.env.VITE_BASE_RPC_URL,
            polygon: import.meta.env.VITE_POLYGON_RPC_URL,
        },
        tokens: {
            in: inToken,
            amountIn: amountIn,
            out: outToken,
            poolFee: poolFee,
        },
    }
}

export const CurrentConfig: ExampleConfig = createSwapConfig(WETH_TOKEN, USDC_TOKEN, 0.5105, FeeAmount.MEDIUM)

// export const CurrentConfig: ExampleConfig = {
//   rpc: {
//     local: 'http://localhost:8545',
//     mainnet: '',
//     baseSepolia: import.meta.env.VITE_BASE_SEPOLIA_RPC_URL,
//     base: import.meta.env.VITE_BASE_RPC_URL,
//     polygon: import.meta.env.VITE_POLYGON_RPC_URL,
//   },
//   tokens: {
//     in: USDC_TOKEN,
//     amountIn: 1000,
//     out: WETH_TOKEN,
//     poolFee: FeeAmount.MEDIUM,
//   },
// }