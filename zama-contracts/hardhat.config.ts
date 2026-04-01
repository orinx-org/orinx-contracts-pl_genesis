import "@fhevm/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-deploy";
import { HardhatUserConfig } from 'hardhat/config'
import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.24',
		settings: {
			evmVersion: 'cancun',
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	defaultNetwork: 'sepolia',
	networks: {
		// Sepolia testnet configuration - Zama fhEVM supported
		sepolia: {
			url: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			chainId: 11155111,
			gasMultiplier: 1.2,
			timeout: 60000,
		},
	},

	// Optional: Add Etherscan verification config
	etherscan: {
		apiKey: {
			sepolia: process.env.ETHERSCAN_API_KEY || '',
		},
	},
}

export default config