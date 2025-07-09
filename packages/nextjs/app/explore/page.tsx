"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCoinsLastTraded, getCoinsMostValuable, getCoinsNew, setApiKey } from "@zoralabs/coins-sdk";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

// import { notification } from "@/utils/scaffold-eth";

setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY || "");

interface CoinNode {
  id: string;
  name: string;
  symbol: string;
  address: string;
  creatorAddress: string;
  totalSupply: string;
  marketCap: string;
  volume24h: string;
  createdAt: string;
  uniqueHolders: string;
  description?: string;
  totalVolume?: string;
  uniswapV3PoolAddress?: string;
}

interface ExploreListResponse {
  data?: {
    exploreList?: {
      edges: { node: CoinNode; cursor: string }[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}

type FetchFn = () => Promise<ExploreListResponse>;

interface ExploreTab {
  id: string;
  label: string;
  fetchFunction: FetchFn;
}

function safeFormatEther(wei: string | undefined): string {
  if (!wei) return "0";
  try {
    return formatEther(BigInt(wei));
  } catch {
    return "0";
  }
}

export default function ExplorePage() {
  const { address } = useAccount();
  const [coins, setCoins] = useState<CoinNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ExploreTab["id"]>("new");

  const exploreTabs: ExploreTab[] = useMemo(
    () => [
      {
        id: "new",
        label: "🆕 New Coins",
        fetchFunction: () => getCoinsNew({ count: 20 }) as Promise<ExploreListResponse>,
      },
      {
        id: "valuable",
        label: "💎 Most Valuable",
        fetchFunction: () => getCoinsMostValuable({ count: 20 }) as Promise<ExploreListResponse>,
      },
      {
        id: "trending",
        label: "🔥 Recently Traded",
        fetchFunction: () => getCoinsLastTraded({ count: 20 }) as Promise<ExploreListResponse>,
      },
    ],
    [],
  );

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    const tab = exploreTabs.find(t => t.id === activeTab);
    if (!tab) return setLoading(false);

    try {
      const res = await tab.fetchFunction();
      const edges = res.data?.exploreList?.edges || [];
      setCoins(
        edges.map(({ node }) => ({
          ...node,
          totalSupply: safeFormatEther(node.totalSupply),
          marketCap: safeFormatEther(node.marketCap),
          volume24h: safeFormatEther(node.volume24h),
        })),
      );
    } catch (err) {
      console.error("Error fetching coins:", err);
      // notification.error("Failed to fetch coins. Please try again.");
      console.error("Failed to fetch coins. Please try again.");
      setCoins([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, exploreTabs]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg" />
          <p>Loading coins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">🔍 Explore Blog Post Coins</h1>

      <div className="tabs tabs-boxed mb-8 bg-base-200">
        {exploreTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {coins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl opacity-70">No coins found</p>
          <p className="text-sm opacity-50">Try a different category or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.map(c => (
            <div key={c.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h2 className="card-title text-lg">{c.name}</h2>
                <p className="text-sm opacity-70 mb-2">
                  <strong>Symbol:</strong> {c.symbol}
                </p>
                <p className="text-sm opacity-70 mb-4">
                  <strong>Creator:</strong> {`${c.creatorAddress.slice(0, 6)}…${c.creatorAddress.slice(-4)}`}
                </p>

                <div className="stats stats-vertical shadow bg-base-200">
                  <div className="stat py-2">
                    <div className="stat-title text-xs">Market Cap</div>
                    <div className="stat-value text-sm">{c.marketCap !== "0" ? `${c.marketCap} ETH` : "N/A"}</div>
                  </div>
                  <div className="stat py-2">
                    <div className="stat-title text-xs">24h Volume</div>
                    <div className="stat-value text-sm">{c.volume24h !== "0" ? `${c.volume24h} ETH` : "N/A"}</div>
                  </div>
                  <div className="stat py-2">
                    <div className="stat-title text-xs">Holders</div>
                    <div className="stat-value text-sm">{c.uniqueHolders}</div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4 gap-2">
                  <button className="btn btn-outline btn-sm">📖 View Post</button>
                  <button className="btn btn-primary btn-sm">💰 Trade</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!address && (
        <div className="alert alert-info mt-8">
          <span>💡 Connect your wallet to trade coins and support creators</span>
        </div>
      )}
    </div>
  );
}
