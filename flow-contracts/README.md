# Orinx on Flow 🔒

### The Privacy Layer for Flow
**Orinx** allows users to receive, hold, and send funds onchain while protecting their **financial privacy**.

## 🔐 Orinx at a Glance

- **Zero-Trust Architecture**: Privacy guarantees remain intact even if the blockchain, frontend, or all external infrastructure are fully observable.
- **Client-Side Privacy**: All sensitive cryptography and key derivation happens locally.
- **Non-Custodial**: Keys never leave the user’s device.
- **Recoverable**: Funds can always be recovered directly from the chain without Orinx UI.
- **Auditable**: Users can selectively disclose transaction history when required.

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen" />
  <img src="https://img.shields.io/badge/Chain--Agnostic-blueviolet" />
  <img src="https://img.shields.io/badge/Network-Flow%Testnet-blue" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black" />
  <img src="https://img.shields.io/badge/Wagmi-grey?style=for-the-badge&logo=wagmi&logoColor=white" />
</div>

## ⚡ TL;DR
Orinx brings **Institutional Privacy** to Flow. We use stealth addresses to securely decouple your public identity from private settlement. Stay **non-custodial**, avoid mixers, and keep enterprise transactions **unlinkable**.

> **"Privacy is not about hiding bad things. It's about protecting good people."**

## 🚫 The Problem: The Glass House

Blockchains are **architectures of surveillance**.

By default, every transaction you make—payments, salary, medical bills, donations—is broadcast to the world forever. Standard wallets don't just leak your data; they **dox** your entire financial life to:
*   **Ad Tech**: Building profiles of your net worth and spending habits.
*   **Bad Actors**: Targeting you for phishing or extortion based on your balance.
*   **Competitors**: Monitoring your business's cash flow and supply chain.

**Real finance requires confidentiality.** Orinx bridges the gap between transparent chains and the privacy we need.

---

## 🕶️ The Solution: Cryptographic Privacy

Orinx is an **on-chain privacy protocol** that brings **Stealth Addresses** to Flow.

We decouple your **Public Identity** from your **On-Chain Assets**.

1.  **Public Identity (The Meta-Address)**: You share a single, static ID (e.g., `alice@orinx`). Think of this as a **public instruction manual**. It tells people exactly how to generate a unique address for you, without you needing to be online.
2.  **Private Settlement**: When Bob pays you, the protocol mathematically derives a **unique, unlinked address** just for that payment.
3.  **Unified Dashboard**: Orinx aggregates all these scattered addresses into a single view. To you, it looks like one balance. To the blockchain, it looks like thousands of unrelated wallets.

---

## 🔥 Key Features

### 1. Fortress-Level Security 🏰
Orinx acts like a Hardware Wallet inside your browser.

*   **Isolated Execution**: All sensitive cryptography (signing, derivation) happens locally.
*   **Zero Leakage**: Your private keys **NEVER** leave your device. The UI "views" your balance but cannot touch your keys.
*   **"Scorched Earth" Policy**: If you close the tab, the keys are wiped from memory instantly. Nothing is persisted.

### 2. Smart 2FA (Identity Binding) 🔐
Your seed phrase isn't enough. Standard wallets have a fatal flaw: if someone steals your seed phrase, your money is gone.

Orinx implements Identity Binding:

*   We bind your wallet keys to a **PIN/Password** using high-hardness cryptography.
*   **The Result**: Even if an attacker steals your 12-word phrase, **they cannot access your Orinx funds** without your 2FA PIN/Password.
*   It is a **cryptographic second factor**, meaning your wallet address cannot be derived without your PIN.

### 3. Stealth Forwarding 🔄
Move funds from one stealth address to another—without ever touching a public exchange.

*   Pay a supplier, a friend, or an employee directly from your **unlinked** private balance.
*   The transaction remains mathematically **unlinked**.

### 4. Manual Recovery ("The Safety Net") 🚨
We believe in "Trust, but Verify". Orinx is non-custodial.

*   **Missed a scan?** The Manual Recovery tool scans the **entire blockchain history** to find your funds.
*   Even if our indexer goes down, your funds are always recoverable directly from the chain.

### 5. Privacy 📕
*   Even we (the developers) cannot see who you know and paid.

---

## 🚀 Why Flow?

Orinx + Flow is the perfect combination for the next generation of privacy-preserving applications.

### 1. Instant Finality (Low Latency) ⚡
Privacy usually means "slow" (waiting for mixers or ZK provers). On Flow, stealth payments feel **instant**. This low latency is critical for physical Point-of-Sale (POS) and high-frequency use cases.

### 2. Micro-Transaction Ready (Low Cost) 🪙
Traditional privacy layers are too expensive for small payments. Flow's ultra-low fees allow Orinx to support **tipping, gaming rewards, and micro-subscriptions** privately—use cases that were previously impossible.

---

## 🎯 Flow Focus

Orinx is built to accelerate the adoption of **Privacy** across key Flow verticals, focusing deeply on the following hackathon tracks:

### 1. Payments & Financial Infrastructure 💸 (Payments Track)
Privacy is the missing piece of frictionless financial infrastructure. Businesses and individuals need to transact in stable assets without exposing their entire net worth or supply chain.
*   **Stablecoin Native**: Orinx supports private transfers of standardized tokens (e.g., ERC-20, SPL) across supported networks for frictionless payments.
*   **Merchant & Cross-Border Payments**: Accept crypto for goods and services or utilize cross-border settlement APIs without doxxing your business treasury to competitors.
*   **Payroll & On-Chain Settlements**: Enable private salary payments allowing DAO contributors and freelancers to receive funds confidentially.

### 2. Wallets & Consumer Applications 🎮 (Wallets Track)
We bring "Web2 Usability" to Web3 Privacy, driving mainstream adoption through enhanced UX and layered security.
*   **Seamless Onboarding & UX**: Our Username System (`alice@orinx`) replaces 42-character hex strings, making crypto accessible to non-technical users.
*   **Identity & Account Abstraction**: A portable privacy layer integrating natively with Account Abstraction wallets to provide a secure identity foundation.
*   **Gaming Guilds & Consumer dApps**: Settle payments for consumer dApps or tournament winners privately, preventing on-chain sniping or targeted harassment.

### 3. Core Privacy Infrastructure 🛡️ (Privacy/Security Track)
At its core, Orinx is a fundamental primitive that enables true financial confidentiality on a public ledger.
*   **Zero-Trust Architecture**: We decouple the user's public identity from their private settlement address using Stealth Addresses (DKSAP).
*   **Auditable & Compliant**: Users retain the ability to selectively disclose transaction history for compliance and tax purposes without compromising absolute privacy.
*   **Non-Custodial Data**: All cryptographic derivation happens locally on the user's device, ensuring sensitive keys never touch external infrastructure.

---

## 🏗️ Technical Architecture

Orinx is built on a **"Trust Nothing"** architecture.

### 🛡️ Threat Model
Orinx is designed under a zero-trust threat model.
The blockchain and frontend are treated as untrusted, and privacy guarantees must hold even if all infrastructure except the client’s local worker is fully observable.

### The Transaction Lifecycle
```mermaid
sequenceDiagram
    participant Sender
    participant Registry as OrinxRegistry
    participant Announcer as OrinxAnnouncer
    participant Alice as Alice (Receiver)

    Sender->>Registry: 1. Resolve 'alice@orinx'
    Registry-->>Sender: Return Meta-Address (Public Keys)
    Sender->>Sender: 2. Derive Ephemeral Key & Shared Secret (ECDH)
    Sender->>Announcer: 3. Send Funds + Encrypted Announcement
    Announcer-->>Alice: 4. Emit Event (Ciphertext)
    Alice->>Alice: 5. Scan & Decrypt (Locally)
    Alice->>Alice: 6. Funds Detected & Recovered
```

### Smart Contract Architecture (Modular)
We split the logic to ensure future-proofing and security:
*   **`OrinxRegistry.sol` (Identity Layer)**: Immutable. Maps `@username` to `Meta-Address`. Enforces uniqueness and ownership.
*   **`OrinxAnnouncer.sol` (Stateless Payment Layer)**: Handles the flow of funds. It emits events for scanning but **holds no user state**, ensuring maximum gas efficiency.

### The Stack
*   **Frontend**: React, TypeScript, Viem, Wagmi.
*   **Cryptography**: `@noble/secp256k1`, `scrypt-js`, `hkdf` (Client-side execution).
*   **Contracts**: Solidity v0.8.28.
*   **Indexing**: Flow Mirror Node REST API (Custom highly scalable historical query engine).

---

## 📊 Privacy Landscape

**Unlike mixers (e.g. Tornado Cash) or ZK wallets, Orinx avoids pooled funds and prover overhead.**

| Feature | Standard Wallet | Mixer (Tornado) | Orinx (Stealth) |
| :--- | :---: | :---: | :---: |
| **Privacy** | ❌ None | ✅ High | ✅ High |
| **Compliance** | ✅ High | ❌ Low (Sanctions) | ✅ High (Non-Custodial) |
| **User Experience** | ✅ Easy | ❌ Hard | ✅ Seamless |
| **Mobile Ready** | ✅ Yes | ❌ No | ✅ Yes |

---

## ⚠️ Limitations & Tradeoffs

Orinx provides strong on-chain privacy, but **not perfect anonymity**.

*   **Timing Correlations**: Stealth addresses do not hide *when* a transaction occurs.
*   **Client Security**: Privacy depends on your device not being compromised (e.g. keyloggers).
*   **Not a Mixer**: We do not pool funds. This offers better compliance but different privacy properties than Tornado Cash.
*   **Traceability (Feature)**: Unlike mixers, Orinx preserves the on-chain history of funds. This means you can prove the origin of unlimited funds to auditors (using your View Key) without doxxing yourself to the public.

> **"We believe honest disclosure is essential for legitimate financial privacy tools."**

---

## 🎨 Design Philosophy

*   **Institutional Grade**: We don't look like a toy. We look like a terminal.
*   **Dark Mode First**: Optimized for long sessions and privacy.
*   **Mobile Responsive**: The "Vault" fits in your pocket.

---

## 🧠 The Orinx Manifesto

**Why We Built This**: We aren't just building a wallet wrapper. We are building the **privacy layer for the future of finance**.

### 🏆 Our Unfair Advantage
We don't just write code; we ship products.

*   **Obsessive Security**: We built a custom **"Cold Worker"** architecture from scratch to isolate keys.
*   **Mobile-Native Experience**: We bring privacy to the **Mobile Era**. We optimized every interaction for touch devices because we know that **payments happen on the go**, not just on desktops.

### Core Values
*   **Privacy is a Human Right**: Not a feature toggle. It is the default state of a free society.
*   **Code over Trust**: We rely on **Elliptic Curve Cryptography**, not promises.
*   **Extreme Velocity**: We ship fast. If a feature blocks adoption, we build it.

> **"We bridge the gap between 'cypherpunk' tech and 'fintech' usability."**

---

## ✅ Transparency & Trust (Flow Deployment)

We believe privacy tools must be open and verifiable.

### Deployed Contracts (Flow Testnet)

| Chain | Network ID | Contract | Address | Explorer |
| :--- | :--- | :--- | :--- | :--- |
| **Flow Testnet** | `545` | **OrinxRegistry** | `0x6fb4986C0deb035d69d5089aE9824F2293aa02B0` | [View](https://evm-testnet.flowscan.io/address/0x6fb4986C0deb035d69d5089aE9824F2293aa02B0?tab=contract) |
| **Flow Testnet** | `545` | **OrinxAnnouncer** | `0xd6bf5AA102b7125CF7ee587F26d41963eD4999bA` | [View](https://evm-testnet.flowscan.io/address/0xd6bf5AA102b7125CF7ee587F26d41963eD4999bA?tab=contract) |

### Network Configuration for Wallets

To interact with Orinx on Flow Testnet, ensure your wallet is configured with:

- **RPC URL**: `https://testnet.evm.nodes.onflow.org`
- **Chain ID**: `545`
- **Currency**: `FLOW`
- **Explorer**: `https://evm-testnet.flowscan.io`

## 🚀 Try Orinx on Flow

**Send a private payment on Flow in under 60 seconds.**

1.  **Get Testnet FLOW**: Visit the [Flow Faucet](https://faucet.flow.com/fund-account) to claim testnet FLOW.
2.  **Connect**: Go to the [Orinx App](https://orinx-pl.vercel.app/) and connect your wallet.
3.  **Register**: Claim your unique stealth username (e.g., `alice@orinx`).
4.  **Transact**: Send and receive private payments using FLOW or Tokens (e.g.: USDC, USDT) on Flow Testnet.


---

## ⚖️ "Good Actor" Compliance

Orinx is designed for **legitimate privacy**, not illicit evasion.

*   **Auditable Privacy**: Need to prove a payment for tax or audit purposes? Orinx allows you to **export your transaction history** in one click.
*   **Selective Disclosure**: You are in control. You can reveal specific transactions to counterparties or regulators without doxxing your entire financial life.
*   **Non-Custodial**: We never hold your funds.

---

## 🎯 Who Is Orinx For?

*   **Freelancers**: Receiving salary in USDC without clients tracking their net worth.
*   **Founders**: Paying for operational expenses without leaking runway data.
*   **Traders**: Keeping alpha strategies private from copy-traders.
*   **Crowdfunding**: Raising funds for a sensitive cause without exposing every donor's identity.
*   **Friends & Family**: Splitting dinner bills or sending gifts without revealing your main wallet balance.
*   **Enterprise Supply Chains**: Settling high-frequency B2B invoices without exposing supplier flow to competitors.
*   **Healthcare Providers**: Executing compliant, onchain medical payroll and vendor payments safely.
*   **Corporate Treasuries**: Managing operational expenses, paying contractors, and diversifying assets without leaking runway data.
*   **DAOs & Foundations**: Paying core contributors or grant recipients weekly without exposing the treasury's full history to targeting or harassment.
*   **High-Net-Worth Individuals (HNWI)**: Privately settling OTC trades and investments while retaining the ability to selectively disclose to auditors.

---

### Orinx Contracts (Flow)

This repository contains the core smart contracts for the Orinx protocol on Flow.

- `OrinxAnnouncer.sol`: Handles stealth payment announcements and fee collection.
- `OrinxRegistry.sol`: Manages username to stealth meta-address mappings.

### Setup

```bash
# Clone the repository
  git clone https://github.com/orinx-org/orinx-contracts-pl_genesis.git

# Navigate to the contracts
  cd orinx-contracts-pl_genesis/flow-contracts

# Install dependencies:
  npm install

# Configure environment variables:
  - Copy `.env.example` to `.env`
  - Set `FLOW_PRIVATE_KEY` and `FLOW_RPC_URL`.
```

### Usage

Compile contracts:
```bash
npx hardhat compile
```

Run tests:
```bash
npx hardhat test
```

### Deployment

To deploy to Flow Testnet:
1.  Ensure `.env` is configured with `FLOW_PRIVATE_KEY` and `FLOW_RPC_URL`.
2.  Run the deployment script:
    ```bash
    npx hardhat run scripts/deploy.ts --network flowTestnet
    ```
    This will deploy `OrinxRegistry` and `OrinxAnnouncer` and log their addresses.

## Verification

The project includes a test suite for core functionality.
```bash
npx hardhat test
```
Expected output:
```
  Orinx Protocol
    OrinxRegistry
      ✔ Should register a username
      ✔ Should revert if username is taken
    OrinxAnnouncer
      ✔ Should emit Announcement event
```

---


## 🤝 Contributing

We are open source and welcome contributions!

1.  **Fork** the repository.
2.  Create a **Feature Branch** (`git checkout -b feature/amazing-feature`).
3.  **Commit** your changes (`git commit -m 'Add some amazing feature'`).
4.  **Push** to the branch (`git push origin feature/amazing-feature`).
5.  Open a **Pull Request**.

---

## 💬 Community & Support

Join the conversation and build the future with us.

*   [**Twitter (@OrinxProtocol)**](https://x.com/OrinxProtocol)

> **"We build in public. Come say hi."**

### Contributors

![Contributors](https://contrib.rocks/image?repo=orinx-org/orinx-contracts-pl_genesis)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## ❓ FAQ

- **Q: Which wallets is Orinx compatible with?**

  **A:** Orinx works alongside your existing wallet. It is compatible with **MetaMask**, **Rainbow**, **Coinbase Wallet**, and any WalletConnect-enabled wallet.    

- **Q: Is Orinx meant to hide illicit activity?**

  **A: No.** Orinx is designed for **legitimate financial privacy**. It is **non-custodial** and supports **selective disclosure**.

- **Q: Can I use Orinx for taxes and accounting?**

  **A: Yes.** You can export your full transaction history in one click.

- **Q: Is this a Mixer (like Tornado Cash)?**

  **A: No.** Mixers pool funds. Orinx uses **Stealth Addresses** to derive unique, unlinked addresses for every payment. Your funds never mix with others.

---

<p align="center">
  <b>Built by founders, for the future.</b><br>
  <i>Secure. Private. Unstoppable.</i>
</p>
