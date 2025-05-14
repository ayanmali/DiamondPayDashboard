// // Approve DEX router to spend tokens
// const { config: approvalConfig } = usePrepareContractWrite({
//     address: TOKEN_ADDRESSES[sendTokenSymbol],
//     abi: ERC20_ABI,
//     functionName: 'approve',
//     args: [UNISWAP_ROUTER_ADDRESS, parseUnits(amount, decimals)],
//   });

// // Swap tokens and send to recipient
// const { config: swapConfig } = usePrepareContractWrite({
//   address: UNISWAP_ROUTER_ADDRESS,
//   abi: UNISWAP_ROUTER_ABI,
//   functionName: 'swapExactTokensForTokens',
//   args: [
//     // Amount in
//     parseUnits(amount, decimals),
//     // Minimum amount out (with slippage)
//     calculateMinimumAmountOut(quote, slippage),
//     // Path for the swap
//     [TOKEN_ADDRESSES[sendTokenSymbol], TOKEN_ADDRESSES[receiveTokenSymbol]],
//     // Recipient address
//     recipientAddress,
//     // Deadline (expiration)
//     Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
//   ],
// });

// // Example of fetching a quote from 1inch (production code)
// const fetchQuote = async () => {
//   try {
//     const response = await fetch(
//       `https://api.1inch.io/v5.0/1/quote?` +
//       `fromTokenAddress=${TOKEN_ADDRESSES[sendTokenSymbol]}` +
//       `&toTokenAddress=${TOKEN_ADDRESSES[receiveTokenSymbol]}` +
//       `&amount=${parseUnits(amount, decimals)}`
//     );
//     const quoteData = await response.json();
//     setQuote({
//       inputAmount: parseFloat(formatUnits(quoteData.fromTokenAmount, quoteData.fromToken.decimals)),
//       outputAmount: parseFloat(formatUnits(quoteData.toTokenAmount, quoteData.toToken.decimals)),
//       route: quoteData.protocols.flat(),
//       estimatedGas: quoteData.estimatedGas,
//     });
//   } catch (error) {
//     console.error('Error fetching quote:', error);
//   }
// };