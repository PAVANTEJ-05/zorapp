"use client";

import { useEffect, useState } from "react";
import {
  DeployCurrency,
  createCoin,
  createMetadataBuilder,
  createZoraUploaderForCreator,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { Address, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

// Set API key immediately (following Zora docs pattern)
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ZORA_API_KEY) {
  setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY);
}

interface BlogPost {
  title: string;
  content: string;
  description: string;
}

interface CoinCreationResult {
  hash: string;
  address: string;
  deployment: any;
}

export default function PostMintHome() {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: "",
    content: "",
    description: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createdCoin, setCreatedCoin] = useState<CoinCreationResult | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogPost(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        notification.error("Please select a valid image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        notification.error("Image file size must be less than 10MB");
        return;
      }

      setImageFile(file);
      notification.success(`Image selected: ${file.name}`);
    }
  };

  const createBlogPostCoin = async () => {
    // Validation
    if (!connectedAddress || !walletClient) {
      notification.error("Please connect your wallet");
      return;
    }

    if (!blogPost.title.trim()) {
      notification.error("Post title is required");
      return;
    }

    if (!blogPost.content.trim()) {
      notification.error("Post content is required");
      return;
    }

    if (!imageFile) {
      notification.error("Featured image is required");
      return;
    }

    setIsCreating(true);

    try {
      // Create public client for Base Sepolia (following Zora docs pattern)
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      notification.info("📝 Creating metadata...");

      // Create metadata using Zora's metadata builder (from documentation)
      const { createMetadataParameters } = await createMetadataBuilder()
        .withName(blogPost.title.trim())
        .withSymbol(
          blogPost.title
            .slice(0, 5)
            .toUpperCase()
            .replace(/[^A-Z]/g, "") || "POST",
        )
        .withDescription(blogPost.description.trim() || blogPost.content.slice(0, 200).trim())
        .withImage(imageFile)
        .upload(createZoraUploaderForCreator(connectedAddress as Address));

      notification.info("✅ Metadata uploaded to IPFS!");

      // Create coin parameters (following Zora documentation structure)
      const coinParams = {
        ...createMetadataParameters,
        payoutRecipient: connectedAddress as Address,
        chainId: baseSepolia.id,
        // Note: Using ETH for Base Sepolia as ZORA is not supported (per docs)
        currency: DeployCurrency.ETH,
      };

      notification.info("🪙 Creating coin...");

      // Create the coin using Zora SDK (exact pattern from documentation)
      const result = await createCoin(coinParams, walletClient, publicClient, {
        gasMultiplier: 120, // 20% buffer as recommended in docs
      });

      console.log("Transaction hash:", result.hash);
      console.log("Coin address:", result.address);
      console.log("Deployment details:", result.deployment);

      setCreatedCoin({
        hash: result.hash,
        address: result.address ?? "",
        deployment: result.deployment,
      });
      notification.success("🎉 Blog post coin created successfully!");

      // Reset form
      setBlogPost({ title: "", content: "", description: "" });
      setImageFile(null);
    } catch (error: any) {
      console.error("Error creating coin:", error);

      // Enhanced error handling
      if (error.message?.includes("upload") || error.message?.includes("IPFS")) {
        notification.error("IPFS upload failed. Please try with a smaller image.");
      } else if (error.message?.includes("timeout")) {
        notification.error("Transaction timeout. Check your wallet for pending transactions.");
      } else if (error.message?.includes("rejected") || error.message?.includes("denied")) {
        notification.error("Transaction was rejected by user.");
      } else if (error.message?.includes("insufficient")) {
        notification.error("Insufficient funds. Get Base Sepolia ETH from the faucet.");
      } else {
        notification.error(`Creation failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading while client-side rendering initializes
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">📝 PostMint - Publish to Earn</h1>

        {/* Network Status for Base Sepolia */}
        <div className="bg-warning/10 border border-warning rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <h3 className="font-semibold text-warning">Network: Base Sepolia Testnet</h3>
              <p className="text-sm opacity-70">Make sure your wallet is connected to Base Sepolia (Chain ID: 84532)</p>
              <p className="text-sm opacity-70">Currency: ETH (ZORA not supported on Base Sepolia)</p>
              <a
                href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm link link-primary"
              >
                Need testnet ETH? Get it from the Base Sepolia faucet
              </a>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Create Your Blog Post Coin</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Post Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={blogPost.title}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter your blog post title"
                maxLength={100}
              />
              <div className="text-xs opacity-60 mt-1">{blogPost.title.length}/100 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={blogPost.description}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Brief description of your post"
                maxLength={200}
              />
              <div className="text-xs opacity-60 mt-1">{blogPost.description.length}/200 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Featured Image <span className="text-error">*Required</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />
              {imageFile && (
                <div className="mt-2 p-2 bg-success/10 rounded-lg">
                  <p className="text-sm text-success">
                    ✅ Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
              <div className="text-xs opacity-60 mt-1">
                Maximum file size: 10MB. Supported formats: JPG, PNG, GIF, WebP
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Content <span className="text-error">*</span>
              </label>
              <textarea
                name="content"
                value={blogPost.content}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-40"
                placeholder="Write your blog post content here..."
                maxLength={5000}
              />
              <div className="text-xs opacity-60 mt-1">{blogPost.content.length}/5000 characters</div>
            </div>

            <div className="pt-4">
              <button
                onClick={createBlogPostCoin}
                disabled={
                  isCreating || !connectedAddress || !blogPost.title.trim() || !blogPost.content.trim() || !imageFile
                }
                className="btn btn-primary w-full"
              >
                {isCreating ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Coin...
                  </>
                ) : (
                  "🚀 Create Blog Post Coin"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Created Coin Display */}
        {createdCoin && (
          <div className="bg-success/10 border border-success rounded-3xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-success">🎉 Coin Created Successfully!</h3>
            <div className="space-y-2">
              <p>
                <strong>Transaction Hash:</strong>
                <code className="text-sm ml-2 break-all">{createdCoin.hash}</code>
              </p>
              <p>
                <strong>Coin Address:</strong>
                <code className="text-sm ml-2 break-all">{createdCoin.address}</code>
              </p>
              <p>
                <strong>Network:</strong> Base Sepolia Testnet
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <a
                  href={`https://sepolia.basescan.org/tx/${createdCoin.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline btn-success"
                >
                  View Transaction
                </a>
                <a
                  href={`https://sepolia.basescan.org/address/${createdCoin.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline btn-info"
                >
                  View Coin Contract
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status */}
        {!connectedAddress && (
          <div className="alert alert-warning mb-8">
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
            <span>Please connect your wallet to create blog post coins</span>
          </div>
        )}

        {/* How it Works */}
        <div className="bg-base-100 rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">How PostMint Works on Base Sepolia</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✍️</span>
              <div>
                <h3 className="font-semibold">Write Your Post</h3>
                <p className="text-sm opacity-70">Create compelling content that your audience will love</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🪙</span>
              <div>
                <h3 className="font-semibold">Mint as Coin</h3>
                <p className="text-sm opacity-70">Each post becomes a tradeable ERC-20 token on Base Sepolia</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-semibold">Earn from Trading</h3>
                <p className="text-sm opacity-70">Receive royalties when supporters buy and trade your coins</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="font-semibold">Supporters Win Too</h3>
                <p className="text-sm opacity-70">Early supporters profit when your content goes viral</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
