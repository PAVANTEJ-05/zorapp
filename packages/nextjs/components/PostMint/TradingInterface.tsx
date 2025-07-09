// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, useContractRead, useContractWrite, usePublicClient } from "wagmi";
// import { formatEther, parseEther } from "viem";
// import { baseSepolia } from "viem/chains";
// import {
//   tradeCoin,
//   TradeType,
//   getOnchainCoinDetails,
//   setApiKey
// } from "@zoralabs/coins-sdk";
// import { notification } from "~~/utils/scaffold-eth";

// // Set API key
// setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY || "");

// interface TradingInterfaceProps {
//   coinAddress: string;
//   postTitle: string;
//   postId: string;
// }

// export const TradingInterface = ({ coinAddress, postTitle, postId }: TradingInterfaceProps) => {
//   const { address } = useAccount();
//   const publicClient = usePublicClient();
//   const [tradeAmount, setTradeAmount] = useState("");
//   const [isTrading, setIsTrading] = useState(false);
//   const [coinDetails, setCoinDetails] = useState<any>(null);
//   const [tradeType, setTradeType] = useState<TradeType>(TradeType.BUY);

//   // Fetch coin details on mount
//   useEffect(() => {
//     const fetchCoinDetails = async () => {
//       if (!coinAddress) return;

//       try {
//         const details = await getOnchainCoinDetails({
//           coinAddress: coinAddress as `0x${string}`,
//           chainId: baseSepolia.id,
//         });
//         setCoinDetails(details);
//       } catch (error) {
//         console.error("Error fetching coin details:", error);
//       }
//     };

//     fetchCoinDetails();
//   }, [coinAddress]);

//   // Support post function
//   const { writeAsync: supportPost } = useContractWrite({
//     address: process.env.NEXT_PUBLIC_POSTMINT_CONTRACT as `0x${string}`,
//     abi: [
//       {
//         inputs: [
//           { name: "_postId", type: "uint256" },
//           { name: "_coinAmount", type: "uint256" }
//         ],
//         name: "supportPost",
//         outputs: [],
//         stateMutability: "payable",
//         type: "function"
//       }
//     ],
//     functionName: "supportPost",
//   });

//   const handleTrade = async () => {
//     if (!address || !tradeAmount || !coinAddress) {
//       notification.error("Please connect wallet and enter amount");
//       return;
//     }

//     setIsTrading(true);
//     try {
//       const result = await tradeCoin({
//         coinAddress: coinAddress as `0x${string}`,
//         tradeType,
//         amount: parseEther(tradeAmount),
//         chainId: baseSepolia.id,
//         // Add slippage tolerance
//         slippagePercent: 5,
//       });

//       notification.success(`Successfully ${tradeType === TradeType.BUY ? 'bought' : 'sold'} coins!`);

//       // Also update the post support if buying
//       if (tradeType === TradeType.BUY) {
//         await supportPost({
//           args: [BigInt(postId), parseEther(tradeAmount)],
//           value: parseEther(tradeAmount),
//         });
//       }

//       setTradeAmount("");

//       // Refresh coin details
//       const updatedDetails = await getOnchainCoinDetails({
//         coinAddress: coinAddress as `0x${string}`,
//         chainId: baseSepolia.id,
//       });
//       setCoinDetails(updatedDetails);

//     } catch (error) {
//       console.error("Error trading:", error);
//       notification.error("Trade failed. Please try again.");
//     } finally {
//       setIsTrading(false);
//     }
//   };

//   return (
//     <div className="card bg-base-100 shadow-xl">
//       <div className="card-body">
//         <h2 className="card-title">💰 Trade: {postTitle}</h2>

//         {coinDetails && (
//           <div className="stats stats-vertical shadow mb-4">
//             <div className="stat">
//               <div className="stat-title">Current Price</div>
//               <div className="stat-value text-lg">
//                 {formatEther(BigInt(coinDetails.price || "0"))} ETH
//               </div>
//             </div>
//             <div className="stat">
//               <div className="stat-title">Market Cap</div>
//               <div className="stat-value text-sm">
//                 {formatEther(BigInt(coinDetails.marketCap || "0"))} ETH
//               </div>
//             </div>
//             <div className="stat">
//               <div className="stat-title">Total Supply</div>
//               <div className="stat-value text-sm">
//                 {formatEther(BigInt(coinDetails.totalSupply || "0"))}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="form-control mb-4">
//           <label className="label">
//             <span className="label-text">Trade Type</span>
//           </label>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setTradeType(TradeType.BUY)}
//               className={`btn btn-sm ${tradeType === TradeType.BUY ? 'btn-success' : 'btn-outline'}`}
//             >
//               Buy
//             </button>
//             <button
//               onClick={() => setTradeType(TradeType.SELL)}
//               className={`btn btn-sm ${tradeType === TradeType.SELL ? 'btn-error' : 'btn-outline'}`}
//             >
//               Sell
//             </button>
//           </div>
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Amount (ETH)</span>
//           </label>
//           <input
//             type="number"
//             step="0.001"
//             value={tradeAmount}
//             onChange={(e) => setTradeAmount(e.target.value)}
//             placeholder="0.01"
//             className="input input-bordered"
//           />
//         </div>

//         <div className="card-actions justify-end mt-4">
//           <button
//             onClick={handleTrade}
//             disabled={isTrading || !address || !tradeAmount}
//             className={`btn ${tradeType === TradeType.BUY ? 'btn-success' : 'btn-error'}`}
//           >
//             {isTrading ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 Trading...
//               </>
//             ) : (
//               `${tradeType === TradeType.BUY ? '🟢 Buy' : '🔴 Sell'} Coins`
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
