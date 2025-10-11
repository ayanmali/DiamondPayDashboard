// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

import { Token, SUPPORTED_CHAINS } from '@uniswap/sdk-core'

// Uniswap V3 Addresses for base sepolia
export const POOL_FACTORY_CONTRACT_ADDRESS =
    '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
export const QUOTER_CONTRACT_ADDRESS =
    '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a'

// Currencies and Tokens
// supported chains 17 is base sepolia

// sepolia base token addresses
// export const WETH_TOKEN = new Token(
//     SUPPORTED_CHAINS[17],
//     '0x4200000000000000000000000000000000000006',
//     18,
//     'WETH',
//     'Wrapped Ether'
// )

// export const USDC_TOKEN = new Token(
//     SUPPORTED_CHAINS[17],
//     '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
//     6,
//     'USDC',
//     'USD//C'
// )

// export const EURC_TOKEN = new Token(
//     SUPPORTED_CHAINS[17],
//     '0x808456652fdb597867f38412077A9182bf77359F',
//     6,
//     'EURC',
//     'EUR//C'
// )

// base mainnet token addresses
export const WETH_TOKEN = new Token(
    SUPPORTED_CHAINS[17],
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
)

export const USDC_TOKEN = new Token(
    SUPPORTED_CHAINS[17],
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    6,
    'USDC',
    'USD//C'
)

export const EURC_TOKEN = new Token(
    SUPPORTED_CHAINS[17],
    '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42',
    6,
    'EURC',
    'EUR//C'
)