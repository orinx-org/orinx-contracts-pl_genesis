# Orinx 🔒

### The Privacy Layer for Web3
> **Incognito mode for your crypto wallet.**

**Orinx** brings **stealth payments** to multiple chains—enabling users to receive, hold, and send funds while protecting their **financial privacy**.

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen" />
  <img src="https://img.shields.io/badge/Chains-Flow%20%7C%20Ethereum%20(Sepolia)-blue" />
</div>

---

## 🎯 Hackathon Submission: Flow + Zama Tracks

This repository contains Orinx's multi-chain privacy infrastructure, submitted for **Flow** and **Zama** hackathon tracks.

| Track | Directory | Description |
|-------|-----------|-------------|
| **Flow** | [`flow-contracts/`](./flow-contracts/) | Stealth addresses on Flow EVM Testnet |
| **Zama** | [`zama-contracts/`](./zama-contracts/) | FHE-encrypted stealth payments on Sepolia |

---

## ⚡ TL;DR for Judges

Orinx is an **on-chain privacy protocol** that makes stealth addresses accessible to mainstream users.

**Key Innovation**: We combine **Stealth Addresses** (unlinkable recipients) with **Fully Homomorphic Encryption** (hidden amounts) for complete payment privacy—while remaining non-custodial and auditable.

> **"Privacy is not about hiding bad things. It's about protecting good people."**

---

## 🏆 Why Orinx Wins

### 1. Real Privacy Problem, Real Solution
Blockchains are **architectures of surveillance**. Every transaction exposes your entire financial history. Orinx fixes this with:
- **Stealth Addresses**: One-time use addresses that unlink sender from receiver
- **Encrypted Balances**: FHE-powered (`euint64`) balances that hide amounts from validators
- **Non-Custodial**: We never hold your funds—unlike mixers (regulatory risk)

### 2. Multi-Chain by Design
We don't just build for one chain. Orinx is architected for **deployment across any EVM chain**:
- **Flow**: Instant finality for retail payments
- **Ethereum (Zama fhEVM)**: FHE-encrypted confidential DeFi

### 3. Mainstream-Ready UX
- **Username System**: `alice@orinx` replaces 42-character hex strings
- **No Wallet Switching**: Works alongside MetaMask, Rainbow, Coinbase Wallet
- **Mobile Optimized**: Privacy that fits in your pocket

---

## � Track Fit: Infrastructure & Digital Rights

### Why Orinx Belongs Here

| Track Pillar | Orinx Implementation |
|--------------|---------------------|
| **Privacy-Preserving Technologies** | Stealth addresses + FHE-encrypted balances hide transaction graph from public surveillance |
| **Data Ownership** | Users exclusively control their encrypted balances—only they can decrypt via Zama Gateway |
| **Cryptography** | Production-grade DKSAP (stealth addresses) + Zama `euint64` homomorphic operations |
| **Censorship-Resistant** | Non-custodial protocol—funds cannot be frozen or blacklisted at contract level |

### Real-World Problem We Solve

**The Surveillance Economy**: Every blockchain transaction is permanently recorded and analyzed. Ad tech firms, competitors, and bad actors scrape this data to:
- Profile net worth and spending patterns
- Target high-balance wallets for phishing/extortion  
- Monitor business cash flows and supply chains

**Orinx Solution**: We provide **cryptographic privacy** as infrastructure—not a feature. Users get:
- **Unlinkable addresses**: Each payment uses a unique, one-time stealth address
- **Encrypted amounts**: FHE ensures validators compute on ciphertext (never seeing balances)
- **Selective disclosure**: Users can audit their history without doxxing themselves publicly

### Consumer Impact

> *"Just as HTTPS became invisible infrastructure for web privacy, Orinx aims to be the invisible infrastructure for blockchain privacy."*

- **Non-technical users** get privacy without understanding cryptography
- **Merchants** accept crypto without exposing treasury balances
- **DAOs** pay contributors privately without revealing full financial picture

---

## � Track Fit: Design New Economic & Governance Systems

### Why Orinx Belongs Here

| Track Pillar | Orinx Implementation |
|--------------|---------------------|
| **Programmable Treasuries** | FHE-encrypted balances let DAOs manage treasuries without public exposure of holdings |
| **Public Goods Funding** | Private payroll for open-source contributors—hide amounts, verify impact publicly |
| **DePIN/DeSci Coordination** | Contributors earn for bandwidth/data without linking earnings to real-world identity |
| **Novel Markets** | Encrypted amounts enable confidential OTC deals and dark pool-style coordination |

### Governance & Coordination Use Cases

**DAO Private Payroll**: Core contributors can receive stablecoin salaries without:
- Competitors estimating runway from payroll outflows
- Contributors being targeted based on token holdings
- Treasury size being inferred from payment sizes

**Impact Attestation**: Projects can prove they paid contributors $X without revealing:
- Who received payments (stealth addresses)
- How much each person received (FHE encryption)
- Linking contributor pseudonyms to real identities

### Consumer-Facing Applications

| Example | Orinx Fit |
|---------|-----------|
| **Split-payment apps** | Groups split bills without revealing individual balances |
| **Savings circles** | Tontine payouts with encrypted contribution amounts |
| **Micro-investment DAOs** | Fractional ownership with private position sizes |
| **Prediction market coordination** | Stake without revealing conviction levels via encrypted amounts |

> *"Current DAOs are glass houses—everyone sees the treasury. Orinx enables private treasuries with public accountability."*

---

## � Track Fit: Consumer DeFi (Flow)

**Why Flow?** Flow is the leading consumer L1 trusted by millions (PayPal, NBA, Disney)—designed for high-volume, user-facing applications with EVM compatibility.

### Why Orinx Belongs Here

| Consumer DeFi Requirement | Orinx on Flow Implementation |
|---------------------------|------------------------------|
| **No jargon** | Username system (`alice@orinx`)—no hex strings to copy/paste |
| **No manual steps** | Auto-generated stealth addresses—users just click "Send" |
| **No "sign" fatigue** | Account abstraction-ready: batch stealth derivation + payment |
| **Invisible security** | Keys computed locally—users never see seed phrases for stealth wallets |
| **True ownership** | Non-custodial: users can always recover funds directly from chain |

### Flow Advantages for Consumer Privacy

**Instant Finality**: Flow's 1-block finality means private payments feel as fast as Venmo—critical for retail use.

**Ultra-Low Fees**: Sub-cent transaction costs make micro-payments viable:
- Split dinner bills privately
- Tip creators without fee friction
- Gaming rewards at scale

**EVM Familiarity**: Solidity contracts mean existing tooling (MetaMask, WalletConnect) works out of the box.

### Consumer Use Cases

| Scenario | Without Orinx | With Orinx on Flow |
|----------|---------------|-------------------|
| **Pay a friend** | They see your entire wallet history | They see one unlinkable payment |
| **Receive salary** | Employer knows your net worth | Each paycheck → unique stealth address |
| **Split rent** | Roommates see your other transactions | Only rent payment visible (amount hidden on Zama) |
| **Creator tips** | Fans can track your total earnings | Tips aggregate privately |

> *"Privacy shouldn't require a PhD in cryptography. On Flow, Orinx makes stealth addresses as easy as sending a text."*

---

## 🎯 Track Fit: Confidential Finance (Zama Protocol)

### Judging Criteria Addressed

| Criterion | How Orinx Delivers |
|-----------|-------------------|
| **Innovation** | First protocol combining **Stealth Addresses + FHE**—recipient unlinkability + amount confidentiality |
| **Compliance Awareness** | Selective disclosure: users can decrypt for auditors without doxxing publicly |
| **Real-World Potential** | Solves institutional DeFi adoption blocker (transparency = competitive leakage) |
| **Technical Implementation** | Production-grade: `euint64` balances, `FHE.add/sub` operations, Zama Gateway integration |
| **Production Readiness** | Modular contracts (Registry/Announcer/ShieldedToken), non-custodial design, audited patterns |
| **Usability** | Username-based onboarding, seamless shield/transfer/unshield flow, comprehensive docs |

### The Problem Zama Solves for Orinx

**Without Zama fhEVM**: Stealth addresses hide the **recipient**, but amounts are still public on-chain.

**With Zama fhEVM**: Both **recipient AND amount** remain encrypted:
- Sender sees: "Payment sent" (no recipient address, no amount)
- Validator sees: Ciphertext operations only
- Receiver sees: Decrypted balance via Zama Gateway

### Technical Implementation

```solidity
// ZamaShieldedToken.sol
function stealthTransfer(
    address recipient, 
    externalEuint64 inputEuint64,  // Encrypted amount
    bytes calldata inputProof
) external {
    euint64 amount = FHE.fromExternal(inputEuint64, inputProof);
    _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], amount);
    _encryptedBalances[recipient] = FHE.add(_encryptedBalances[recipient], amount);
    // Validators compute on ciphertext—never see the actual amount!
}
```

### Why Institutions Care

Current DeFi adoption blocked because:
- Treasuries leak alpha to competitors
- Whale wallets get front-run
- Payroll exposes company runway

**Orinx + Zama = Confidential DeFi** where sensitive data remains encrypted, yet verifiably correct.

---

## 🌱 Funding the Commons Builder Residency Fit

**Opportunity**: One PL Genesis builder nominated for **Funding the Commons Builder Residency**—co-living container for deep work on real-world infrastructure.

### Why Orinx Qualifies

| FTC Focus Area | Orinx Real-World Impact |
|----------------|------------------------|
| **Funding Systems** | Private payroll infrastructure for open-source contributors—enables sustainable public goods funding without exposing contributor earnings |
| **Financial Access** | Consumer-grade privacy for emerging markets—users in high-surveillance regions can transact without profiling |
| **Digital Public Goods** | Stealth address protocol is infrastructure any DeFi app can integrate—non-custodial, censorship-resistant, open source |
| **Real-World Conditions** | Tested on Flow (retail payments) + Ethereum Sepolia (institutional DeFi)—deployed, not theoretical |

### Builder Profile

**Serious Work, Grounded Approach**:
- **Production-ready contracts** deployed on 2 chains with real addresses
- **Multi-chain architecture**—not locked to one ecosystem
- **Non-custodial by design**—aligns with web3 values, not centralized rent-seeking
- **Open source** (MIT)—public good itself

**Collaboration Potential**:
- Orinx integrates with any wallet/Dapp—ideal for cross-project collaboration in residency
- FHE + Stealth is foundational—other builders could leverage for DePIN, DeSci, coordination tools

> *"We're not building a feature. We're building privacy infrastructure that makes on-chain finance actually usable for normal humans."*

---

## 📁 Repository Structure

```
orinx-contracts-pl_genesis/
├── flow-contracts/          # Flow Track Submission
│   ├── contracts/
│   │   ├── OrinxRegistry.sol      # Identity layer
│   │   └── OrinxAnnouncer.sol     # Stealth payment router
│   ├── deployments/         # Flow Testnet: 0x6fb4... / 0xd6bf...
│   └── README.md           # Detailed Flow documentation
│
├── zama-contracts/          # Zama Track Submission
│   ├── contracts/
│   │   ├── OrinxRegistry.sol      # Identity layer
│   │   ├── OrinxAnnouncer.sol     # Payment router
│   │   └── ZamaShieldedToken.sol  # FHE-encrypted token wrapper
│   ├── deployments/         # Sepolia: 0x646a... / 0x84cd... / 0x51Fa...
│   └── README.md           # Detailed Zama fhEVM documentation
│
└── README.md               # This file (entry point)
```

---

## 🎬 Quick Demo

**Try Orinx in 60 seconds:**

1.  **Get Testnet Funds**: 
    - Flow: [Flow Faucet](https://faucet.flow.com/fund-account)
    - Sepolia: [Sepolia Faucet](https://sepoliafaucet.com/)
2.  **Connect**: Visit [Orinx App](https://orinx-pl.vercel.app/) and connect your wallet
3.  **Register**: Claim your stealth username (e.g., `alice@orinx`)
4.  **Transact**: Send private payments—stealth addresses hide the recipient, FHE hides the amount

---

## 🔐 Technical Highlights

### Stealth Address Protocol (DKSAP)
```
Sender → Registry: Resolve 'alice@orinx'
Registry → Sender: Meta-Address (Public Keys)
Sender → Sender: Derive Ephemeral Key + Shared Secret (ECDH)
Sender → Announcer: Send Funds + Encrypted Announcement
Announcer → Receiver: Emit Event (Ciphertext)
Receiver → Receiver: Scan & Decrypt Locally
```

### Zama fhEVM Integration
- **`euint64` Encrypted Balances**: Token balances stored as FHE ciphertext
- **Homomorphic Operations**: `FHE.add()` / `FHE.sub()` on encrypted values
- **Zama Gateway**: Decentralized decryption for balance queries

---

## 🚀 Deployed Contracts

### Flow Testnet (Chain ID: 545)
| Contract | Address | Explorer |
|----------|---------|----------|
| OrinxRegistry | `0x6fb4986C0deb035d69d5089aE9824F2293aa02B0` | [View](https://evm-testnet.flowscan.io/address/0x6fb4986C0deb035d69d5089aE9824F2293aa02B0) |
| OrinxAnnouncer | `0xd6bf5AA102b7125CF7ee587F26d41963eD4999bA` | [View](https://evm-testnet.flowscan.io/address/0xd6bf5AA102b7125CF7ee587F26d41963eD4999bA) |

### Ethereum Sepolia (Chain ID: 11155111)
| Contract | Address | Explorer |
|----------|---------|----------|
| OrinxRegistry | `0x646a2868cc212cCe009670D95522f3d6ACB3B521` | [View](https://sepolia.etherscan.io/address/0x646a2868cc212cCe009670D95522f3d6ACB3B521) |
| OrinxAnnouncer | `0x84cd5E4D3946a4B124DD910975BEad31f79501Ac` | [View](https://sepolia.etherscan.io/address/0x84cd5E4D3946a4B124DD910975BEad31f79501Ac) |
| ZamaShieldedToken | `0x51Fae5F50cd885928247E61a102c4860B2A68dfE` | [View](https://sepolia.etherscan.io/address/0x51Fae5F50cd885928247E61a102c4860B2A68dfE) |

---

## 💻 Quick Start

### Flow Contracts
```bash
cd flow-contracts
npm install
cp .env.example .env
# Set FLOW_PRIVATE_KEY and FLOW_RPC_URL
npx hardhat run scripts/deploy.ts --network flowTestnet
```

### Zama Contracts
```bash
cd zama-contracts
npm install
cp .env.example .env
# Set PRIVATE_KEY and SEPOLIA_RPC_URL
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## 📊 Privacy Comparison

| Feature | Standard Wallet | Mixer (Tornado) | **Orinx** |
|---------|-----------------|-----------------|-----------|
| **Balance Privacy** | ❌ Public | ✅ Hidden | ✅ **Encrypted (FHE)** |
| **Amount Privacy** | ❌ Public | ✅ Hidden | ✅ **Encrypted (FHE)** |
| **Address Privacy** | ❌ None | ✅ Mixed | ✅ **Stealth Addresses** |
| **Compliance** | ✅ High | ❌ Sanctioned | ✅ **Auditable + Non-Custodial** |
| **UX** | ✅ Easy | ❌ Hard | ✅ **Seamless** |
| **Multi-Chain** | ✅ Yes | ❌ No | ✅ **Flow + Ethereum** |

**Orinx Advantage**: Unlike mixers (regulatory risk), Orinx is **non-custodial** and **auditable**—users can selectively disclose transactions for compliance without doxxing their entire history.

---

## 🤝 Team & Contributions

Built by founders, for the future.

- **Contributors**: ![Contributors](https://contrib.rocks/image?repo=orinx-org/orinx-contracts-pl_genesis)
- **Twitter**: [@OrinxProtocol](https://x.com/OrinxProtocol)
- **License**: MIT

---

<p align="center">
  <b>Privacy is a Human Right.</b><br>
  <i>Secure. Private. Multi-Chain.</i>
</p>
