# 🎮 Loot Arena - Web3 Mini-Games Platform

> **One-stop game play station and have fun on Flow Testnet!**  
> A decentralized gaming platform powered by **Flow Testnet** where players can earn LootToken (LTK) by playing skill-based and chance-based mini-games.

[![Flow Blockchain](https://img.shields.io/badge/Powered%20by-Flow%20Testnet-00EF8B?style=for-the-badge&logo=flow&logoColor=white)](https://flow.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🚀 Live Demo

**🌐 Play Now:** [https://lootarena.vercel.app/](https://lootarena.vercel.app/)

---

## 🌊 Built on Flow Blockchain

**Network:** Flow Testnet  
**Chain ID:** 545

### 📜 Deployed Smart Contract

**LootToken (LTK) Contract Address:**  
```
0x506B41359218BCac5B648b78a56cA315365487ec
```

🔗 **View on Flow Explorer:**  
[https://evm-testnet.flowscan.io/address/0x506B41359218BCac5B648b78a56cA315365487ec](https://evm-testnet.flowscan.io/address/0x506B41359218BCac5B648b78a56cA315365487ec)

---

## 🎯 Project Overview

**Loot Arena** is your **one-stop game play station** on Flow Testnet - a blockchain-powered gaming platform that combines:
- 🧩 **Skill-based games** (Wordle)
- 🎲 **Chance-based games** (Dice Roll, Coin Flip, Slots)
- 💰 **Token rewards** (LootToken - LTK)
- 🎁 **Daily claims** (100 LTK every 24 hours)
- 🔗 **Web3 wallet integration** (RainbowKit)

### Key Features

✅ **Play-to-Earn Mechanics** - Win games, earn LTK tokens  
✅ **Multiple Game Modes** - 4 different games with unique mechanics  
✅ **Pending Rewards System** - Accumulate winnings, claim in batches (gas-efficient)  
✅ **Daily Free Tokens** - Claim 100 LTK every 24 hours  
✅ **Beautiful UI/UX** - Dark theme with purple/pink gradients and smooth animations  
✅ **Real-time Notifications** - Toast notifications for all transactions  

---

## 🎮 Available Games

### 1. 🔤 **Wordle** (Skill-based)
- **Entry Fee:** 5 LTK per session
- **Attempts:** 5 guesses to find the word
- **Rewards:** 
  - 1st guess: 25 LTK
  - 2nd guess: 20 LTK
  - 3rd guess: 15 LTK
  - 4th guess: 10 LTK
  - 5th guess: 5 LTK
- **Mechanics:** Instant reward minting on win

### 2. 🎲 **Dice Roll** (Chance-based)
- **Cost:** 2 LTK per roll
- **Win Condition:** Roll 1 or 6
- **Reward:** 4 LTK (2x multiplier)
- **Mechanics:** Pre-purchase lives, accumulate rewards, batch claim

### 3. 🪙 **Coin Flip** (Chance-based)
- **Cost:** 3 LTK per flip
- **Win Condition:** Guess heads or tails correctly
- **Reward:** 6 LTK (2x multiplier)
- **Mechanics:** Pre-purchase lives, accumulate rewards, batch claim

### 4. 🎰 **Lucky Slots** (Chance-based)
- **Cost:** 5 LTK per spin
- **Win Conditions:**
  - 3 matching symbols: 25 LTK (5x)
  - 2 matching symbols: 10 LTK (2x)
- **Mechanics:** Pre-purchase lives, accumulate rewards, batch claim

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI + Magic UI
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Web3 Integration
- **Wallet Connection:** RainbowKit
- **Blockchain Library:** Wagmi + Viem
- **Smart Contract:** Solidity (ERC-20 Token)
- **Network:** Flow EVM Testnet

### Development Tools
- **Package Manager:** Bun
- **Notifications:** Sonner (Toast)
- **State Management:** React Context API

---

## 📦 Installation & Setup

### Prerequisites
- [Bun](https://bun.sh) installed
- MetaMask or any Web3 wallet
- Flow Testnet configured in your wallet

### 1. Clone the Repository
```bash
git clone https://github.com/mantle0796/LootAreana.git
cd LootAreana
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_TOKEN_ADDRESS=0x506B41359218BCac5B648b78a56cA315365487ec
```

**Get your WalletConnect Project ID:**  
👉 [WalletConnect Cloud](https://cloud.walletconnect.com)

### 4. Add Flow Testnet to MetaMask

**Network Details:**
- **Network Name:** Flow EVM Testnet
- **RPC URL:** `https://testnet.evm.nodes.onflow.org`
- **Chain ID:** `545`
- **Currency Symbol:** `FLOW`
- **Block Explorer:** `https://evm-testnet.flowscan.io`

### 5. Run Development Server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 Demo Video

📹 **Watch the Demo:** [YouTube Link](#) _(Coming Soon)_

---

## 🚀 Deployment

### Live on Vercel

🌐 **Visit:** [https://lootarena.vercel.app/](https://lootarena.vercel.app/)

### Deploy Your Own Instance

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mantle0796/LootAreana)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

---

## 💎 Smart Contract Details

### LootToken (LTK) - ERC-20 Contract

**Contract Code:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LootToken is ERC20 {
    constructor() ERC20("LootToken", "LTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
```

**Key Functions:**
- `balanceOf(address)` - Check token balance
- `mint(address, uint256)` - Mint reward tokens
- `transfer(address, uint256)` - Transfer tokens

**Token Details:**
- **Name:** LootToken
- **Symbol:** LTK
- **Decimals:** 18
- **Initial Supply:** 1,000,000 LTK

---

## 🏗️ Project Structure

```
loot-arena/
├── app/
│   ├── games/
│   │   ├── wordle/          # Wordle game
│   │   ├── dice/            # Dice roll game
│   │   ├── coinflip/        # Coin flip game
│   │   └── slots/           # Slots game
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Landing page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Navigation with wallet
│   │   └── Footer.tsx       # Footer
│   ├── games/
│   │   ├── PurchaseLivesModal.tsx    # Pre-purchase modal
│   │   └── ClaimRewardsButton.tsx    # Claim rewards UI
│   ├── animations/
│   │   └── Effects.tsx      # Animation components
│   └── ui/                  # Shadcn UI components
├── contexts/
│   └── PendingRewardsContext.tsx     # Reward state management
├── hooks/
│   ├── useToken.ts          # Token interactions
│   └── useWordleToken.ts    # Wordle-specific hooks
├── config/
│   └── wagmi.ts             # Web3 configuration
├── contracts/
│   └── tokenABI.ts          # Smart contract ABI
└── lib/
    └── utils.ts             # Utility functions
```

---

## 🎨 Features Breakdown

### 1. Web3 Wallet Integration
- RainbowKit for seamless wallet connection
- Support for MetaMask, WalletConnect, Coinbase Wallet, etc.
- Automatic network switching to Flow Testnet

### 2. Token Economy
- **Daily Claims:** Get 100 LTK every 24 hours (free)
- **Entry Fees:** Pay tokens to play games
- **Rewards:** Earn tokens by winning games
- **Pending System:** Accumulate rewards from multiple games, claim in one transaction (saves gas)

### 3. Game Mechanics
- **Wordle:** Skill-based word puzzle with decreasing rewards
- **Gambling Games:** Chance-based with pre-purchase system for better UX
- **Fair Odds:** Transparent win probabilities
- **Instant Feedback:** Real-time animations and notifications

### 4. User Experience
- Responsive design (mobile, tablet, desktop)
- Dark theme with mesmerizing animations
- Toast notifications for all blockchain interactions
- Loading states and error handling
- Smooth transitions with Framer Motion

---

## 🔐 Security Considerations

⚠️ **Testnet Disclaimer:** This project is deployed on Flow Testnet for demonstration purposes.

**For Production Deployment:**
1. Add access control to `mint()` function
2. Implement game result verification (prevent cheating)
3. Add rate limiting for claims and gameplay
4. Conduct smart contract audit
5. Implement proper random number generation (VRF)
6. Add emergency pause functionality

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🎮 Add new games
- 🎨 Improve UI/UX
- 📖 Improve documentation

**Fork & Pull Request Workflow:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-game`)
3. Commit changes (`git commit -m 'Add amazing game'`)
4. Push to branch (`git push origin feature/amazing-game`)
5. Open a Pull Request

---

## 📱 Social Media

📢 **Follow our updates:**

🐦 **Twitter/X:** Built on [@flow_blockchain](https://twitter.com/flow_blockchain)  
💬 **Discord:** [Join our community](#)  
📺 **YouTube:** [Watch tutorials](#)  

**🎮 Try Loot Arena - Your one-stop game play station on Flow Testnet!**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Flow Blockchain** - For providing an amazing EVM-compatible testnet
- **RainbowKit** - For beautiful wallet connection UI
- **Shadcn UI** - For excellent component library
- **Magic UI** - For stunning animation components
- **Vercel** - For seamless Next.js hosting

---

## 📞 Contact & Support

**Questions? Issues? Feedback?**

- 🐛 Issues: [GitHub Issues](https://github.com/mantle0796/LootAreana/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mantle0796/LootAreana/discussions)
- 🌐 Live App: [https://lootarena.vercel.app/](https://lootarena.vercel.app/)

---

## 🎯 Roadmap

### ✅ Phase 1 (Current - Deployed)
- [x] Core token system
- [x] 4 playable games
- [x] Wallet integration
- [x] Pending rewards system
- [x] Live deployment on Vercel

### 🔄 Phase 2 (In Progress)
- [ ] Slither.io multiplayer game
- [ ] Leaderboard system
- [ ] Achievement NFTs
- [ ] Social features

### 🚀 Phase 3 (Planned)
- [ ] Mainnet deployment
- [ ] Tournament system
- [ ] Staking rewards
- [ ] DAO governance

---

<div align="center">

**Built with ❤️ on Flow Blockchain**

⭐ Star this repo if you found it helpful!

[🎮 Play Now](https://lootarena.vercel.app/) • [📖 Documentation](#) • [🐦 Twitter](#)

**One-stop game play station and have fun on Flow Testnet!**

</div>
