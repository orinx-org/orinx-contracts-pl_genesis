import { ethers, network } from "hardhat";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

interface DeploymentRecord {
  network: string;
  chainId: number;
  deployer: string;
  timestamp: string;
  contracts: {
    OrinxRegistry?: string;
    OrinxAnnouncer?: string;
    MockERC20?: string;
    ZamaShieldedToken?: string;
  };
}

console.log("FILE LOADED");

async function main() {
  console.log("STARTING DEPLOYMENT SCRIPT...");
  const [deployer] = await ethers.getSigners();
  console.log("Got signer:", deployer);
  const deployerAddress = await deployer.getAddress();
  console.log("Deployer address:", deployerAddress);
  const networkName = network.name;
  const chainId = (await ethers.provider.getNetwork()).chainId;

  console.log("========================================");
  console.log("Zama FHE Contract Deployment");
  console.log("========================================");
  console.log(`Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployerAddress))} ETH`);
  console.log("========================================\n");

  const deploymentRecord: DeploymentRecord = {
    network: networkName,
    chainId: Number(chainId),
    deployer: deployerAddress,
    timestamp: new Date().toISOString(),
    contracts: {},
  };

  // ========================================
  // 1. Deploy OrinxRegistry
  // ========================================
  console.log("[1/4] Deploying OrinxRegistry...");
  const RegistryFactory = await ethers.getContractFactory("OrinxRegistry");
  const registry = await RegistryFactory.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  deploymentRecord.contracts.OrinxRegistry = registryAddress;
  console.log(`✓ OrinxRegistry deployed to: ${registryAddress}`);

  // ========================================
  // 2. Deploy OrinxAnnouncer
  // ========================================
  console.log("\n[2/4] Deploying OrinxAnnouncer...");
  const AnnouncerFactory = await ethers.getContractFactory("OrinxAnnouncer");
  const announcer = await AnnouncerFactory.deploy();
  await announcer.waitForDeployment();
  const announcerAddress = await announcer.getAddress();
  deploymentRecord.contracts.OrinxAnnouncer = announcerAddress;
  console.log(`✓ OrinxAnnouncer deployed to: ${announcerAddress}`);

  // ========================================
  // 3. Deploy MockERC20 (for testing) or use existing
  // ========================================
  let underlyingTokenAddress: string;
  const existingToken = process.env.SEPOLIA_UNDERLYING_TOKEN;

  if (existingToken && existingToken.startsWith("0x")) {
    console.log(`\n[3/4] Using existing underlying token: ${existingToken}`);
    underlyingTokenAddress = existingToken;
  } else {
    console.log("\n[3/4] Deploying MockERC20 for testing...");
    const MockTokenFactory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockTokenFactory.deploy("Mock USDC", "mUSDC");
    await mockToken.waitForDeployment();
    underlyingTokenAddress = await mockToken.getAddress();
    deploymentRecord.contracts.MockERC20 = underlyingTokenAddress;
    console.log(`✓ MockERC20 deployed to: ${underlyingTokenAddress}`);
    
    // Mint some tokens to deployer for testing
    console.log("  Minting 100,000 mUSDC to deployer...");
    const mintAmount = ethers.parseUnits("100000", 0); // 100k with 0 decimals for uint64 compatibility
    await mockToken.mint(deployerAddress, mintAmount);
    console.log(`  ✓ Minted ${mintAmount.toString()} mUSDC to ${deployerAddress}`);
  }

  // ========================================
  // 4. Deploy ZamaShieldedToken
  // ========================================
  console.log("\n[4/4] Deploying ZamaShieldedToken...");
  console.log(`  Underlying token: ${underlyingTokenAddress}`);
  
  const ShieldedTokenFactory = await ethers.getContractFactory("ZamaShieldedToken");
  const shieldedToken = await ShieldedTokenFactory.deploy(underlyingTokenAddress);
  await shieldedToken.waitForDeployment();
  const shieldedTokenAddress = await shieldedToken.getAddress();
  deploymentRecord.contracts.ZamaShieldedToken = shieldedTokenAddress;
  console.log(`✓ ZamaShieldedToken deployed to: ${shieldedTokenAddress}`);

  // ========================================
  // 5. Setup Announcer (Optional)
  // ========================================
  if (process.env.FEE_RECEIVER) {
    console.log("\n[Setup] Configuring fee receiver...");
    await announcer.setFeeReceiver(process.env.FEE_RECEIVER);
    console.log(`✓ Fee receiver set to: ${process.env.FEE_RECEIVER}`);
  }

  if (process.env.FEE_BPS) {
    const feeBps = parseInt(process.env.FEE_BPS);
    if (feeBps > 0 && feeBps <= 500) { // Max 5%
      console.log(`\n[Setup] Setting fee to ${feeBps / 100}%...`);
      await announcer.setFee(feeBps);
      console.log(`✓ Fee set to ${feeBps} bps`);
    }
  }

  // ========================================
  // 6. Save Deployment Record
  // ========================================
  console.log("\n========================================");
  console.log("Saving deployment record...");
  
  const deploymentsDir = join(__dirname, "..", "deployments");
  const deploymentsFile = join(deploymentsDir, `${networkName}.json`);

  let allDeployments: DeploymentRecord[] = [];
  if (existsSync(deploymentsFile)) {
    allDeployments = JSON.parse(readFileSync(deploymentsFile, "utf8"));
  }
  
  allDeployments.push(deploymentRecord);
  
  // Create directory if it doesn't exist
  const { mkdirSync } = await import("fs");
  if (!existsSync(deploymentsDir)) {
    mkdirSync(deploymentsDir, { recursive: true });
  }
  
  writeFileSync(deploymentsFile, JSON.stringify(allDeployments, null, 2));
  console.log(`✓ Deployment record saved to: ${deploymentsFile}`);

  // Also save latest addresses for easy reference
  const latestFile = join(deploymentsDir, "latest.json");
  writeFileSync(latestFile, JSON.stringify(deploymentRecord, null, 2));
  console.log(`✓ Latest addresses saved to: ${latestFile}`);

  // ========================================
  // Summary
  // ========================================
  console.log("\n========================================");
  console.log("DEPLOYMENT SUMMARY");
  console.log("========================================");
  console.log(`Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`Deployer: ${deployerAddress}`);
  console.log("\nContract Addresses:");
  console.log(`  OrinxRegistry:     ${registryAddress}`);
  console.log(`  OrinxAnnouncer:    ${announcerAddress}`);
  if (deploymentRecord.contracts.MockERC20) {
    console.log(`  MockERC20:         ${underlyingTokenAddress}`);
  }
  console.log(`  ZamaShieldedToken: ${shieldedTokenAddress}`);
  console.log("\n========================================");
  console.log("Next Steps:");
  console.log("1. Update frontend constants with deployed addresses");
  console.log("2. Verify contracts on Etherscan:");
  console.log(`   npx hardhat verify --network ${networkName} ${registryAddress}`);
  console.log(`   npx hardhat verify --network ${networkName} ${announcerAddress}`);
  if (deploymentRecord.contracts.MockERC20) {
    console.log(`   npx hardhat verify --network ${networkName} ${underlyingTokenAddress} "Mock USDC" "mUSDC"`);
  }
  console.log(`   npx hardhat verify --network ${networkName} ${shieldedTokenAddress} ${underlyingTokenAddress}`);
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
