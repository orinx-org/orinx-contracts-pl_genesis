import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import hre from "hardhat";
const { ethers } = hre;
import { ZamaShieldedToken, OrinxAnnouncer } from "../typechain-types";
import { expect } from "chai";

// Access fhevm from hre
const fhevm = (hre as any).fhevm;

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
  stealthUser: HardhatEthersSigner;
};

async function deployFixture() {
  // Deploy Mock ERC20 Token
  const mockTokenFactory = await ethers.getContractFactory("MockERC20");
  const mockToken = await mockTokenFactory.deploy("Mock Token", "MTK");
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();

  // Deploy ZamaShieldedToken
  const shieldedTokenFactory = await ethers.getContractFactory("ZamaShieldedToken");
  const shieldedToken = (await shieldedTokenFactory.deploy(mockTokenAddress)) as unknown as ZamaShieldedToken;
  await shieldedToken.waitForDeployment();
  const shieldedTokenAddress = await shieldedToken.getAddress();

  // Deploy OrinxAnnouncer
  const announcerFactory = await ethers.getContractFactory("OrinxAnnouncer");
  const announcer = (await announcerFactory.deploy()) as unknown as OrinxAnnouncer;
  await announcer.waitForDeployment();
  const announcerAddress = await announcer.getAddress();

  return { mockToken, mockTokenAddress, shieldedToken, shieldedTokenAddress, announcer, announcerAddress };
}

describe("OrinxAnnouncer - Shielded Transfers", function () {
  let signers: Signers;
  let mockToken: any;
  let shieldedToken: ZamaShieldedToken;
  let shieldedTokenAddress: string;
  let announcer: OrinxAnnouncer;
  let announcerAddress: string;

  const INITIAL_SUPPLY = ethers.parseEther("10000");
  const SHIELD_AMOUNT = ethers.parseUnits("1000", 0); // 1000 wei/tokens (fits in uint64)
  const TRANSFER_AMOUNT = 100n;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2], stealthUser: ethSigners[3] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite should run with FHEVM mock environment. Use --network hardhat`);
      this.skip();
    }

    ({ mockToken, shieldedToken, shieldedTokenAddress, announcer, announcerAddress } = await deployFixture());

    // Mint and shield tokens to alice for testing
    await mockToken.mint(signers.alice.address, INITIAL_SUPPLY);
    await mockToken.connect(signers.alice).approve(shieldedTokenAddress, SHIELD_AMOUNT);
    await shieldedToken.connect(signers.alice).shield(SHIELD_AMOUNT);
  });

  describe("sendShieldedStealth", function () {
    it("should emit announcement after direct shielded transfer", async function () {
      // Create encrypted input for transfer
      const encryptedInput = await fhevm
        .createEncryptedInput(shieldedTokenAddress, signers.alice.address)
        .add64(TRANSFER_AMOUNT)
        .encrypt();

      const ephemeralPubKeyX = ethers.zeroPadBytes("0x01", 32);
      const ephemeralPubKeyY = ethers.zeroPadBytes("0x02", 32);
      const ciphertext = ethers.toUtf8Bytes("encrypted-metadata");

      // Step 1: Perform shielded transfer directly (required for FHE - encrypted input bound to signer)
      await shieldedToken
        .connect(signers.alice)
        .stealthTransfer(
          signers.stealthUser.address,
          encryptedInput.handles[0],
          encryptedInput.inputProof
        );

      // Step 2: Emit announcement via announcer
      await expect(
        announcer
          .connect(signers.alice)
          .announceShieldedStealth(
            shieldedTokenAddress,
            signers.stealthUser.address,
            ephemeralPubKeyX,
            ephemeralPubKeyY,
            ciphertext
          )
      )
        .to.emit(announcer, "ShieldedAnnouncement")
        .withArgs(
          1, // schemeId
          signers.stealthUser.address,
          shieldedTokenAddress,
          ephemeralPubKeyX,
          ephemeralPubKeyY,
          ciphertext
        );

      // Verify encrypted balances exist for both parties
      const aliceBalance = await shieldedToken.getEncryptedBalance(signers.alice.address);
      const stealthBalance = await shieldedToken.getEncryptedBalance(signers.stealthUser.address);

      expect(aliceBalance).to.not.eq(ethers.ZeroHash);
      expect(stealthBalance).to.not.eq(ethers.ZeroHash);
    });

    it("should revert announcement when shielded token is zero address", async function () {
      await expect(
        announcer
          .connect(signers.alice)
          .announceShieldedStealth(
            ethers.ZeroAddress,
            signers.stealthUser.address,
            ethers.zeroPadBytes("0x01", 32),
            ethers.zeroPadBytes("0x02", 32),
            "0x"
          )
      ).to.be.revertedWithCustomError(announcer, "InvalidTarget");
    });

    it("should revert announcement when stealth address is zero address", async function () {
      await expect(
        announcer
          .connect(signers.alice)
          .announceShieldedStealth(
            shieldedTokenAddress,
            ethers.ZeroAddress,
            ethers.zeroPadBytes("0x01", 32),
            ethers.zeroPadBytes("0x02", 32),
            "0x"
          )
      ).to.be.revertedWithCustomError(announcer, "InvalidTarget");
    });

    it("should revert announcement when contract is paused", async function () {
      // Pause the announcer
      await announcer.togglePause();

      await expect(
        announcer
          .connect(signers.alice)
          .announceShieldedStealth(
            shieldedTokenAddress,
            signers.stealthUser.address,
            ethers.zeroPadBytes("0x01", 32),
            ethers.zeroPadBytes("0x02", 32),
            "0x"
          )
      ).to.be.revertedWithCustomError(announcer, "EnforcedPause");
    });

    it("should allow announcement after unpausing", async function () {
      // Pause and unpause (toggle twice)
      await announcer.togglePause();
      await announcer.togglePause();

      // Perform shielded transfer directly first
      const encryptedInput = await fhevm
        .createEncryptedInput(shieldedTokenAddress, signers.alice.address)
        .add64(TRANSFER_AMOUNT)
        .encrypt();

      await shieldedToken
        .connect(signers.alice)
        .stealthTransfer(
          signers.stealthUser.address,
          encryptedInput.handles[0],
          encryptedInput.inputProof
        );

      // Should succeed after unpausing - just emit announcement
      await expect(
        announcer
          .connect(signers.alice)
          .announceShieldedStealth(
            shieldedTokenAddress,
            signers.stealthUser.address,
            ethers.zeroPadBytes("0x01", 32),
            ethers.zeroPadBytes("0x02", 32),
            "0x"
          )
      ).to.emit(announcer, "ShieldedAnnouncement");
    });

    it("should handle multiple shielded transfers with announcements", async function () {
      const encryptedInput1 = await fhevm
        .createEncryptedInput(shieldedTokenAddress, signers.alice.address)
        .add64(50n)
        .encrypt();

      const encryptedInput2 = await fhevm
        .createEncryptedInput(shieldedTokenAddress, signers.alice.address)
        .add64(50n)
        .encrypt();

      // First transfer + announcement
      await shieldedToken
        .connect(signers.alice)
        .stealthTransfer(
          signers.bob.address,
          encryptedInput1.handles[0],
          encryptedInput1.inputProof
        );
      
      await announcer
        .connect(signers.alice)
        .announceShieldedStealth(
          shieldedTokenAddress,
          signers.bob.address,
          ethers.zeroPadBytes("0x01", 32),
          ethers.zeroPadBytes("0x02", 32),
          "0x"
        );

      // Second transfer + announcement
      await shieldedToken
        .connect(signers.alice)
        .stealthTransfer(
          signers.bob.address,
          encryptedInput2.handles[0],
          encryptedInput2.inputProof
        );
      
      await announcer
        .connect(signers.alice)
        .announceShieldedStealth(
          shieldedTokenAddress,
          signers.bob.address,
          ethers.zeroPadBytes("0x03", 32),
          ethers.zeroPadBytes("0x04", 32),
          "0x"
        );

      // Verify bob has encrypted balance
      const bobBalance = await shieldedToken.getEncryptedBalance(signers.bob.address);
      expect(bobBalance).to.not.eq(ethers.ZeroHash);
    });
  });
});
