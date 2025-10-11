import { ethers } from 'ethers'
import { computePoolAddress } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { CurrentConfig } from './uniswap-config'
import { POOL_FACTORY_CONTRACT_ADDRESS, QUOTER_CONTRACT_ADDRESS } from './constants'
import { fromReadableAmount, toReadableAmount } from './conversions'
import { BASE_QUOTER_ABI } from '../../../../abis/base-quoter-abi'
import { useReadContract } from 'wagmi'
import { FC } from 'react'

const poolConstants = await getPoolConstants();

function getProvider() {
    return new ethers.JsonRpcProvider(CurrentConfig.rpc.base)
}

// Displays the amount of output tokens that would be received for a given amount of input tokens
export const SwapQuote: FC = () => {

  const { data: quotedAmountOut, error, isPending, isLoading } = useReadContract({
    address: QUOTER_CONTRACT_ADDRESS,
    abi: BASE_QUOTER_ABI,
    functionName: 'quoteExactInputSingle',
    args: [{
      tokenIn: poolConstants.token0,
      tokenOut: poolConstants.token1,
      amountIn: fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString(),
      fee: poolConstants.fee,
      sqrtPriceLimitX96: 0
    }]
  })

  if (isPending) return <div>Pending...</div>
  if (isLoading) return <div>Loading...</div>
  if (error)
    return (
      <div>
        Error: {`${error.message}`}
      </div>
    )

  return (
    <div>
      Quoted Amount Out: {quotedAmountOut ? 
        toReadableAmount((quotedAmountOut as Array<number>)[0], CurrentConfig.tokens.out.decimals) : 
        '0'
      }
    </div>
  )
}

async function getPoolConstants(): Promise<{
  token0: string
  token1: string
  fee: number
}> {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.out,
    tokenB: CurrentConfig.tokens.in,
    fee: CurrentConfig.tokens.poolFee,
  })

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    getProvider()
  )
 
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ])

  return {
    token0,
    token1,
    fee,
  }
}