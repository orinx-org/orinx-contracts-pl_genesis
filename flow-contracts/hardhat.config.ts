import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        flowTestnet: {
            url: process.env.FLOW_RPC_URL || "https://testnet.evm.nodes.onflow.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        hardhat: {
        },
    },
    etherscan: {
        apiKey: process.env.FLOW_EXPLORER_API_KEY,  // get your api key from https://pro.subscan.io/
        customChains: [
            {
                network: "flowTestnet",
                chainId: 545,
                urls: {
                    apiURL: "https://evm-testnet.flowscan.io/api",
                    browserURL: "https://evm-testnet.flowscan.io"
                }
            }
        ]
    }
};

export default config;
