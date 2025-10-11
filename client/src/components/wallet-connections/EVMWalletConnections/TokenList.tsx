import { Token } from "@/pages/wallets";
/* Gets a list of tokens from the wallet and their balances */
import { Button } from "@/components/ui/button";
import { KNOWN_TOKENS } from "@/lib/known-tokens";
import { BigNumberish, ethers } from "ethers";
import { FC, useState, useEffect } from "react"
import ERC20ABI from "@/abis/erc20.json";
import { useAccount, useReadContract } from "wagmi";
import { Balance } from "@/pages/wallets";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ETHIcon from "@/images/eth.svg";
import BaseIcon from "@/images/base.svg";
import PolygonIcon from "@/images/polygon.png";
import OptimismIcon from "@/images/optimism-ethereum-op-logo.svg";
import ArbitrumIcon from "@/images/arbitrum-arb-logo.svg";
import USDCIcon from "@/images/usd-coin-usdc-logo.svg";
import EURCIcon from "@/images/eurc1.svg";
import TetherIcon from "@/images/tether-usdt.svg";
import CADCIcon from "@/images/cadc_2.webp";
import BTCIcon from "@/images/btc.svg";
import DAIIcon from "@/images/dai.svg";
import agEURIcon from "@/images/agEUR.svg";
import SUSDIcon from "@/images/susd.svg";
import ChainlinkIcon from "@/images/Chainlink-Symbol-Blue.svg";

// async function getTokens(chain: string) {
//     const url = 'https://base-mainnet.g.alchemy.com/v2/tTED5nCJOYxl334G9UmKsIKlcBn0KKqI';
//     const headers = {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     };

//     const body = JSON.stringify({
//         id: 1,
//         jsonrpc: "2.0",
//         method: "alchemy_getTokenBalances",
//         params: [
//             "0x93af2601478BA76DF860dc5A38369Ed0CdBdCDf4",
//             "erc20"
//         ]
//     });

//     fetch(url, {
//         method: 'POST',
//         headers: headers,
//         body: body
//     })
//         .then(response => response.json())
//         .then(data => console.log(data))
//         .catch(error => console.error('Error:', error));

// }

// const BASE_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_BASE_RPC_URL);
// const POLYGON_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_POLYGON_RPC_URL);
// const OPTIMISM_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_OPTIMISM_RPC_URL);
// const ARBITRUM_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_ARBITRUM_RPC_URL);

const BASE_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_BASE_SEPOLIA_RPC_URL);
const POLYGON_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_POLYGON_AMOY_RPC_URL);
const OPTIMISM_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_OPTIMISM_SEPOLIA_RPC_URL);
const ARBITRUM_PROVIDER = new ethers.JsonRpcProvider(import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC_URL);
/*
// uses KNOWN_TOKENS to get the tokens from the wallet and their balances
function getWalletTokens(address: `0x${string}` | undefined): Balance[] {
    return KNOWN_TOKENS
        .map(t => {
            const { data: balance } = useReadContract({
                abi: ERC20ABI,
                address: t.address, // address of the token
                functionName: 'balanceOf',
                args: [address], // address of the wallet
                query: {
                    enabled: !!address,
                },
            })

            // Add debug logs
            if (t.ticker === 'WETH') {
                console.log('WETH Balance:', balance);
                console.log('WETH Address:', t.address);
                console.log('User Address:', address);
            }

            return {
                token: t,
                amount: ethers.formatUnits(balance as BigNumberish || 0, t.decimals),
                usdAmount: -1
            }
        })
    //.sort((a, b) => Number(b.amount) - Number(a.amount));
    // .filter(t => t.amount !== '0.0');
}
*/
function getProvider(chain: string) {

    switch (chain.toLowerCase()) {
        case 'base':
            return BASE_PROVIDER;
        case 'polygon':
            return POLYGON_PROVIDER;
        case 'optimism':
            return OPTIMISM_PROVIDER;
        case 'arbitrum':
            return ARBITRUM_PROVIDER;
        default:
            return null;
    }
}

// interface CachedBalance {
//     amount: string;
//     timestamp: number;
// }

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const CACHE_KEY = 'token-balances-cache';

function getCachedBalance(address: string, tokenAddress: string): string | null {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        const cacheKey = `${address}-${tokenAddress}`;
        const cached = cache[cacheKey];

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.amount;
        }

        return null;
    } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
    }
}

function setCachedBalance(walletAddress: string, tokenAddress: string, amount: string) {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        const cacheKey = `${walletAddress}-${tokenAddress}`;

        cache[cacheKey] = {
            amount,
            timestamp: Date.now()
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error writing to cache:', error);
    }
}

// Clean up expired cache entries periodically
function cleanupCache() {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        const now = Date.now();

        Object.keys(cache).forEach(key => {
            if (now - cache[key].timestamp > CACHE_DURATION) {
                delete cache[key];
            }
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error cleaning up cache:', error);
    }
}

const GetTokenImage = (token: Token) => {
    switch (token.name.toLowerCase()) {
        case 'wrapped ether':
            return <img src={ETHIcon} alt={token.name} />
        case 'wrapped bitcoin':
            return <img src={BTCIcon} alt={token.name} className="w-8 h-8" />

        case 'polygon':
            return <img src={PolygonIcon} alt={token.name} className="w-8 h-8" />
        case 'optimism':
            return <img src={OptimismIcon} alt={token.name} className="w-8 h-8" />
        case 'arbitrum':
            return <img src={ArbitrumIcon} alt={token.name} className="w-8 h-8" />

        case 'bridged usd coin':
        case 'usd coin (pos)':
        case 'usd coin':
            return <img src={USDCIcon} alt={token.name} className="w-8 h-8" />
        case 'euro coin':
            return <img src={EURCIcon} alt={token.name} className="w-8 h-8" />

        case 'dai':
            return <img src={DAIIcon} alt={token.name} className="w-8 h-8" />

        case 'angle euro':
            return <img src={agEURIcon} alt={token.name} className="w-8 h-8" />

        case 'tether usd (pos)':
        case 'tether usd':
            return <img src={TetherIcon} alt={token.name} className="w-8 h-8" />
        case 'cad coin':
            return <img src={CADCIcon} alt={token.name} className="w-8 h-8" />

        case 'susd':
            return <img src={SUSDIcon} alt={token.name} className="w-8 h-8" />

        case 'chainlink':
            return <img src={ChainlinkIcon} alt={token.name} className="w-8 h-8" />
        default:
            return null;
    }
}

const GetChainImage = (chain: string) => {
    switch (chain.toLowerCase()) {
        case 'base':
            return <img src={BaseIcon} alt={chain} className="w-5 h-5" />
        case 'polygon':
            return <img src={PolygonIcon} alt={chain} className="w-5 h-4"/>
        case 'optimism':
            return <img src={OptimismIcon} alt={chain} className="w-5 h-5" />
        case 'arbitrum':
            return <img src={ArbitrumIcon} alt={chain} className="w-5 h-5"/>
    }
}

export const TokenList: FC = () => {
    //const { address } = useAccount();
    // Call cleanup on component mount
    useEffect(() => {
        cleanupCache();
        // Clean up every 5 minutes
        const interval = setInterval(cleanupCache, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const address = '0x00AC62e3c9E8CE96d5622298dC0374a00132c323';
    const [balances, setBalances] = useState<Balance[]>([]);

    useEffect(() => {
        if (!address) return;

        const fetchBalances = async () => {
            const tokenBalances = await Promise.all(
                KNOWN_TOKENS.map(async (t) => {
                    try {
                        const provider = getProvider(t.chain);

                        // Check cache first
                        const cachedAmount = getCachedBalance(address, t.address);
                        if (cachedAmount) {
                            return {
                                token: t,
                                amount: cachedAmount,
                                usdAmount: -1
                            };
                        }

                        if ((t.name === 'Wrapped Ether' && t.chain.toLowerCase() === 'base') ||
                            (t.name === 'Polygon' && t.chain.toLowerCase() === 'polygon') ||
                            (t.name === 'Optimism' && t.chain.toLowerCase() === 'optimism') ||
                            (t.name === 'Arbitrum' && t.chain.toLowerCase() === 'arbitrum')) {
                            const balanceWei = await provider?.getBalance(address);
                            if (balanceWei) {
                                const balanceEth = Number(ethers.formatEther(balanceWei)).toFixed(2);
                                setCachedBalance(address, t.address, balanceEth);
                                return {
                                    token: t,
                                    amount: balanceEth,
                                    usdAmount: -1
                                };
                            }
                            return {
                                token: t,
                                amount: '0',
                                usdAmount: -1
                            }
                        }

                        const contract = new ethers.Contract(t.address, ERC20ABI, provider);
                        const balance = Number(ethers.formatUnits(await contract.balanceOf(address), t.decimals)).toFixed(2);
                        setCachedBalance(address, t.address, balance);
                        return {
                            token: t,
                            amount: balance,
                            usdAmount: -1
                        };
                    } catch (error) {
                        console.error(`Error fetching balance for ${t.ticker}:`, error);
                        return {
                            token: t,
                            amount: '0',
                            usdAmount: -1
                        };
                    }
                })
            );

            setBalances(tokenBalances.filter(t => t.amount !== '0' && t.amount !== '0.0' && t.amount !== '0.00'));
        };

        fetchBalances();
    }, [address]);

    return (
        <div>
            <Label className="text-lg font-medium">Select payment method</Label>
            {/* {balances.map(balance => (
                <div key={`${balance.token.address}`}>
                    <div className="flex items-center gap-2">
                        <div className="relative inline-block w-10 h-10">
                            {GetTokenImage(balance.token)}
                            <span className="absolute bottom-0 right-0 w-4 h-4">
                                {GetChainImage(balance.token.chain)}
                            </span>
                        </div>
                        <h2>{balance.token.name}</h2>
                    </div>
                    <p>{balance.amount}</p>
                </div>
            ))} */}


            <RadioGroup>
                {!!balances[0] && balances.map(balance => (
                    <div key={`${balance.token.address}`} className="flex items-center gap-2">
                        <RadioGroupItem value={`${balance.token.chain}-${balance.token.address}`} id={`${balance.token.chain}-${balance.token.address}`} />
                        <div key={`${balance.token.address}`} className="pt-7">
                            <div className="flex items-center gap-2">
                                <div className="relative inline-block w-10 h-10">
                                    {GetTokenImage(balance.token)}
                                    <span className="absolute bottom-0 right-0 w-4 h-4">
                                        {GetChainImage(balance.token.chain)}
                                    </span>
                                </div>
                                <h2>{balance.token.name}</h2>
                            </div>
                            <p>{`${balance.amount} ${balance.token.ticker}`}</p>
                        </div>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};