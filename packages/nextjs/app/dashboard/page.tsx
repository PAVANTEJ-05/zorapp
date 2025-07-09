"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCoinsNew, // getCoinsMostValuable,
  // getCoinsLastTraded,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

// import { baseSepolia } from "viem/chains";

// Set API key
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ZORA_API_KEY) {
  setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY);
}

interface CreatorCoin {
  id: string;
  name: string;
  symbol: string;
  address: string;
  createdAt: string;
  totalSupply: string;
  marketCap: string;
  creatorAddress: string;
}

export default function Dashboard() {
  const { address } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [allCoins, setAllCoins] = useState<CreatorCoin[]>([]);
  const [creatorCoins, setCreatorCoins] = useState<CreatorCoin[]>([]);
  const [loading, setLoading] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch coins and filter by creator
  useEffect(() => {
    const fetchAndFilterCoins = async () => {
      if (!address || !isClient) return;

      setLoading(true);
      try {
        // Fetch recent coins from Zora
        const recentCoins = await getCoinsNew({
          count: 50, // Get more coins to increase chance of finding creator's coins
        });

        if (recentCoins?.data?.exploreList?.edges) {
          const formattedCoins = recentCoins.data.exploreList.edges.map((edge: any) => ({
            id: edge.node.id,
            name: edge.node.name || "Untitled Post",
            symbol: edge.node.symbol || "POST",
            address: edge.node.address,
            createdAt: edge.node.createdAt || new Date().toISOString(),
            totalSupply: edge.node.totalSupply || "0",
            marketCap: edge.node.marketCap || "0",
            creatorAddress: edge.node.creatorAddress || "",
          }));

          setAllCoins(formattedCoins);

          // Filter coins created by the connected address
          const userCoins = formattedCoins.filter(
            (coin: CreatorCoin) => coin.creatorAddress.toLowerCase() === address.toLowerCase(),
          );

          setCreatorCoins(userCoins);
        }
      } catch (error) {
        console.error("Error fetching coins:", error);
        // If error occurs, we'll show the empty state
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterCoins();
  }, [address, isClient]);

  // Show loading state
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="hero min-h-[50vh] bg-base-200 rounded-3xl">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">📊</h1>
              <h2 className="text-3xl font-bold mb-4">Creator Dashboard</h2>
              <p className="py-6">
                Connect your wallet to view your PostMint statistics, earnings, and manage your blog post coins.
              </p>
              <div className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>Please connect your wallet to view your dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📊 Creator Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/" className="btn btn-primary">
            Create New Post
          </Link>
          <Link href="/explore" className="btn btn-outline">
            Explore Posts
          </Link>
        </div>
      </div>

      {/* Network Status */}
      <div className="bg-info/10 border border-info rounded-3xl p-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌐</span>
          <div>
            <h3 className="font-semibold">Base Sepolia Testnet</h3>
            <p className="text-sm opacity-70">
              Connected to {address.slice(0, 6)}...{address.slice(-4)} •
              <a
                href={`https://sepolia.basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary ml-1"
              >
                View on Explorer
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-base-100 rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-4">Searching for your coins...</span>
          </div>
        </div>
      )}

      {/* Creator Stats */}
      {creatorCoins.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow rounded-xl">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Your Posts</div>
            <div className="stat-value text-primary">{creatorCoins.length}</div>
            <div className="stat-desc">Blog post coins found</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-xl">
            <div className="stat-figure text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Market Cap</div>
            <div className="stat-value text-success">
              {(() => {
                const totalMarketCap = creatorCoins.reduce((sum, coin) => {
                  return sum + parseFloat(formatEther(BigInt(coin.marketCap || "0")));
                }, 0);
                return totalMarketCap.toFixed(4);
              })()}{" "}
              ETH
            </div>
            <div className="stat-desc">Combined value</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-xl">
            <div className="stat-figure text-info">
              <span className="text-2xl">📊</span>
            </div>
            <div className="stat-title">Total Found</div>
            <div className="stat-value text-info">{allCoins.length}</div>
            <div className="stat-desc">Recent coins scanned</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-xl">
            <div className="stat-figure">
              <div className="text-success text-3xl">✅</div>
            </div>
            <div className="stat-title">Network</div>
            <div className="stat-value text-sm">Base Sepolia</div>
            <div className="stat-desc">Testnet</div>
          </div>
        </div>
      )}

      {/* Your Posts */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">📝 Your Blog Post Coins</h2>
            {creatorCoins.length > 0 && (
              <span className="text-sm opacity-70">
                {creatorCoins.length} post{creatorCoins.length === 1 ? "" : "s"} found
              </span>
            )}
          </div>

          {!loading && creatorCoins.length > 0 ? (
            <div className="space-y-4">
              {creatorCoins.map(coin => (
                <div key={coin.id} className="border rounded-lg p-4 hover:bg-base-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{coin.name}</h3>
                        <div className="badge badge-primary badge-sm">{coin.symbol}</div>
                        <div className="badge badge-success badge-sm">Your Coin</div>
                      </div>
                      <p className="text-sm opacity-70 mb-2">
                        Created: {new Date(coin.createdAt).toLocaleDateString()} • Contract: {coin.address.slice(0, 6)}
                        ...{coin.address.slice(-4)}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatEther(BigInt(coin.marketCap || "0"))} ETH market cap
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                          {formatEther(BigInt(coin.totalSupply || "0"))} supply
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/post/${coin.address}`} // Use coin address instead of index
                        className="btn btn-sm btn-outline"
                      >
                        View Post
                      </Link>

                      <a
                        href={`https://sepolia.basescan.org/address/${coin.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        View Contract
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg opacity-70 mb-2">
                {allCoins.length > 0 ? "No coins found from your address" : "No recent coins found"}
              </p>
              <p className="text-sm opacity-50 mb-6">
                {allCoins.length > 0
                  ? "Your coins might not be in the recent coins list. Try creating a new post!"
                  : "Create your first post to get started!"}
              </p>
              <Link href="/" className="btn btn-primary">
                Create New Post
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Debug Info */}
      {!loading && allCoins.length > 0 && (
        <div className="bg-base-100 rounded-3xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">🔍 Debug Information</h3>
          <div className="text-sm space-y-2">
            <p>
              <strong>Your Address:</strong> {address}
            </p>
            <p>
              <strong>Total Recent Coins Found:</strong> {allCoins.length}
            </p>
            <p>
              <strong>Your Coins Found:</strong> {creatorCoins.length}
            </p>
            <p className="text-xs opacity-70">
              We search through recent coins to find yours. If your coin doesn`t appear, it might not be in the recent
              coins list from Zora`s API.
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-3xl shadow-lg p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/" className="btn btn-outline">
            <span className="text-xl mr-2">✍️</span>
            Create New Post
          </Link>
          <Link href="/explore" className="btn btn-outline">
            <span className="text-xl mr-2">🔍</span>
            Explore Posts
          </Link>
          <a
            href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <span className="text-xl mr-2">🚰</span>
            Get Test ETH
          </a>
        </div>
      </div>
    </div>
  );
}
