import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy OrinxRegistry
    const OrinxRegistry = await ethers.getContractFactory("OrinxRegistry");
    const registry = await OrinxRegistry.deploy();
    await registry.waitForDeployment();
    console.log("OrinxRegistry deployed to:", await registry.getAddress());

    // Deploy OrinxAnnouncer
    const OrinxAnnouncer = await ethers.getContractFactory("OrinxAnnouncer");
    const announcer = await OrinxAnnouncer.deploy();
    await announcer.waitForDeployment();
    console.log("OrinxAnnouncer deployed to:", await announcer.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
