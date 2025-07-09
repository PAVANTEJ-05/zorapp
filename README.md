# PostMint - Publish to Earn

**A Web3-native publishing platform where every blog post becomes a tradeable coin, empowering creators to earn and supporters to invest in viral content.**



## 🌟 Overview

PostMint transforms the traditional publishing model by enabling creators to monetize their content directly through blockchain technology. Built for the Zora Coinathon hackathon, PostMint leverages Zora's CoinV4 protocol to turn every blog post into a tradeable ERC-20 token on Base Sepolia testnet.

## 🔥 Problem Statement

Traditional publishing platforms like Medium, Substack, and Twitter extract all value from creators and give users no upside for their engagement:

- **Writers earn little** from their content
- **Readers get nothing** for their loyalty or support
- **Platforms win** by capturing all the value
- **No direct creator-supporter relationship**

## 💡 Solution

PostMint revolutionizes content monetization by:

- **Every post becomes a coin**: Each blog post is minted as a unique Zora CoinV4 token
- **Direct support mechanism**: Readers mint coins to support writers directly
- **Value appreciation**: Coin value increases as content gains popularity
- **Creator royalties**: Authors earn from each mint and resale
- **Supporter rewards**: Early supporters profit when content goes viral

## 🛠 Tech Stack

### Frontend & Development
- **Next.js 14** - React framework with App Router
- **Scaffold-ETH 2** - Full-stack dApp development template
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **TypeScript** - Type-safe development

### Web3 & Blockchain
- **Zora Coins SDK** - Coin creation and management
- **Zora CoinV4 Protocol** - Core tokenization infrastructure
- **Base Sepolia** - Layer 2 deployment chain
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum client
- **RainbowKit** - Wallet connection interface

### Storage & Infrastructure
- **IPFS** - Decentralized content storage
- **Vercel** - Frontend deployment platform
- **Alchemy/Infura** - RPC providers

## 🚀 Features

### Core Functionality
- **📝 Post Creation**: Rich text editor with image upload support
- **🪙 Coin Minting**: Automatic ERC-20 token creation for each post
- **💰 Trading Interface**: Buy, sell, and trade post coins
- **📊 Analytics Dashboard**: Creator earnings and engagement metrics
- **🔍 Content Discovery**: Explore trending and valuable posts
- **💬 Community Features**: Comments and supporter leaderboards

### Advanced Features
- **🎭 Creator Profiles**: Integrated Zora testnet profiles
- **📈 Market Analytics**: Real-time coin performance tracking
- **🔄 Multi-source Search**: Comprehensive coin discovery
- **💾 Local Caching**: Persistent coin storage
- **🎯 Manual Coin Addition**: Direct contract address support

## 📦 Installation

### Prerequisites
- Node.js 18+ and Yarn
- Git
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/postmint.git
cd postmint
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure environment variables**
```bash
cp packages/nextjs/.env.example packages/nextjs/.env.local
```

4. **Set up environment variables**
```env
NEXT_PUBLIC_ZORA_API_KEY=your_zora_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CHAIN_ID=84532
```

5. **Start the development server**
```bash
yarn dev
```

## 🌐 Network Configuration

PostMint is configured for **Base Sepolia Testnet**:

- **Network**: Base Sepolia
- **Chain ID**: 84532
- **Currency**: ETH (not ZORA on testnet)
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org

### Getting Testnet ETH
Visit the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet) to get free testnet ETH for transactions.

## 📖 Usage Guide

### Creating Your First Post

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the top navigation
   - Select MetaMask or your preferred wallet
   - Switch to Base Sepolia testnet if prompted

2. **Create a Blog Post**
   - Navigate to the home page
   - Fill in the post title, description, and content
   - Upload a featured image (required)
   - Click "🚀 Create Blog Post Coin"

3. **Confirm Transaction**
   - Approve the transaction in your wallet
   - Wait for confirmation (usually 1-2 seconds on testnet)
   - Your post is now minted as an ERC-20 token!

### Managing Your Posts

1. **View Dashboard**
   - Navigate to `/dashboard`
   - See all your created posts and their performance
   - View earnings and market statistics

2. **Check Your Profile**
   - Click your profile in the dashboard
   - View your creator profile on Zora testnet
   - Share your profile with supporters

### Supporting Creators

1. **Discover Posts**
   - Browse the `/explore` page
   - Filter by new, valuable, or trending posts
   - Find creators and content you want to support

2. **Buy Post Coins**
   - Click on any post to view details
   - Use the trading interface to buy coins
   - Support creators directly through purchases

## 🏗 Architecture

### Smart Contract Layer
- **Zora CoinV4 Contracts**: Core token functionality
- **PostMint Contract**: Custom logic for post management
- **ERC-20 Standard**: Each post becomes a standard token

### Frontend Architecture
```
app/
├── page.tsx              # Main post creation page
├── dashboard/
│   └── page.tsx         # Creator dashboard
├── explore/
│   └── page.tsx         # Content discovery
├── post/
│   └── [id]/
│       └── page.tsx     # Individual post view
└── components/
    └── PostMint/        # Custom components
```

### Data Flow
1. **User creates post** → Metadata uploaded to IPFS
2. **Zora SDK processes** → ERC-20 token minted
3. **Transaction confirmed** → Post appears in dashboard
4. **Users discover** → Can buy/trade coins
5. **Creator earns** → Royalties from trading activity

## 🚦 Deployment

### Testnet Deployment

1. **Deploy to Vercel**
```bash
cd packages/nextjs
vercel --prod
```

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure Zora API key is properly set

3. **Test Deployment**
   - Verify wallet connection works
   - Test post creation and coin minting
   - Check all page routes function correctly

### Production Considerations

For mainnet deployment:
- Switch to Base Mainnet configuration
- Use production RPC endpoints
- Implement proper error monitoring
- Add rate limiting for API calls

## 🎯 Hackathon Compliance

PostMint meets all Zora Coinathon criteria:

| Criteria | Implementation |
|----------|----------------|
| **Originality** | ✅ Unique tokenization of written content with supporter investment model |
| **Utility** | ✅ Solves real creator monetization problems with direct value exchange |
| **Zora Integration** | ✅ Uses Zora CoinV4 SDK for minting, metadata, and trading |
| **Polish** | ✅ Professional UI with Scaffold-ETH 2, comprehensive features, and smooth UX |

## 🔧 Development

### Local Development
```bash
# Start development server
yarn dev

# Run type checking
yarn type-check

# Build for production
yarn build
```

### Testing
```bash
# Test components
yarn test

# Test smart contracts (if applicable)
yarn test:contracts
```

### Code Quality
- ESLint configuration for code standards
- TypeScript for type safety
- Prettier for code formatting
- Husky for pre-commit hooks

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Issues**
- Ensure you're on Base Sepolia testnet
- Check that you have testnet ETH for gas fees
- Try refreshing the page and reconnecting

**Post Creation Fails**
- Verify image file size is under 10MB
- Check that all required fields are filled
- Ensure you have sufficient gas fees

**Dashboard Not Showing Posts**
- Posts may take time to appear in search results
- Use the manual add feature with your contract address
- Check that you're connected to the correct wallet


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zora Protocol** for the innovative CoinV4 infrastructure
- **Scaffold-ETH 2** for the excellent development framework
- **Base Network** for reliable Layer 2 infrastructure
- **The Ethereum Community** for building the foundation of Web3
