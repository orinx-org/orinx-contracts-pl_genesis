import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import hre from "hardhat";
const { ethers } = hre;
import { ZamaShieldedToken, OrinxAnnouncer } from "../typechain-types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

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
  const mockTokenFactory = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await mockTokenFactory.deploy("Mock Token", "MTK");
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();

  // Deploy ZamaShieldedToken
  const shieldedTokenFactory = await hre.ethers.getContractFactory("ZamaShieldedToken");
  const shieldedToken = (await shieldedTokenFactory.deploy(mockTokenAddress)) as unknown as ZamaShieldedToken;
  await shieldedToken.waitForDeployment();
  const shieldedTokenAddress = await shieldedToken.getAddress();

  // Deploy OrinxAnnouncer
  const announcerFactory = await hre.ethers.getContractFactory("OrinxAnnouncer");
  const announcer = (await announcerFactory.deploy()) as unknown as OrinxAnnouncer;
  await announcer.waitForDeployment();
  const announcerAddress = await announcer.getAddress();

  return { mockToken, mockTokenAddress, shieldedToken, shieldedTokenAddress, announcer, announcerAddress };
}

describe("ZamaShieldedToken", function () {
  let signers: Signers;
  let mockToken: any;
  let mockTokenAddress: string;
  let shieldedToken: ZamaShieldedToken;
  let shieldedTokenAddress: string;
  let announcer: OrinxAnnouncer;
  let announcerAddress: string;

  const INITIAL_SUPPLY = ethers.parseEther("10000");
  const SHIELD_AMOUNT = ethers.parseUnits("1000", 0); // 1000 tokens (small amount for uint64)
  const TRANSFER_AMOUNT = 100n;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2], stealthUser: ethSigners[3] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite should run with FHEVM mock environment. Use --network hardhat`);
      this.skip();
    }

    ({ mockToken, mockTokenAddress, shieldedToken, shieldedTokenAddress, announcer, announcerAddress } = await deployFixture());

    // Mint tokens to alice for testing
    await mockToken.mint(signers.alice.address, INITIAL_SUPPLY);
  });

  describe("Shielding (Token Deposit)", function () {
    it("should allow user to shield tokens and receive encrypted balance", async function () {
      // Approve shielded token to spend alice's tokens
      await mockToken.connect(signers.alice).approve(shieldedTokenAddress, SHIELD_AMOUNT);

      // Shield tokens
      await expect(shieldedToken.connect(signers.alice).shield(SHIELD_AMOUNT))
        .to.emit(shieldedToken, "Shielded")
        .withArgs(signers.alice.address, SHIELD_AMOUNT);

      // Verify underlying tokens were transferred
      const shieldedBalance = await mockToken.balanceOf(shieldedTokenAddress);
      expect(shieldedBalance).to.equal(SHIELD_AMOUNT);
    });

    it("should revert when shielding zero amount", async function () {
      await expect(shieldedToken.connect(signers.alice).shield(0))
        .to.be.revertedWith("Amount must be > 0");
    });

    it("should revert when shielding amount exceeds uint64 max", async function () {
      const tooMuch = BigInt("18446744073709551616"); // 2^64
      await mockToken.connect(signers.alice).approve(shieldedTokenAddress, tooMuch);
      
      await expect(shieldedToken.connect(signers.alice).shield(tooMuch))
        .to.be.revertedWith("Amount exceeds uint64 max");
    });

    it("should revert with invalid token address", async function () {
      await expect(
        (await ethers.getContractFactory("ZamaShieldedToken")).deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid token address");
    });
  });

  describe("Encrypted Balance", function () {
    beforeEach(async function () {
      // Shield some tokens first
      await mockToken.connect(signers.alice).approve(shieldedTokenAddress, SHIELD_AMOUNT);
      await shieldedToken.connect(signers.alice).shield(SHIELD_AMOUNT);
    });

    it("should return encrypted balance handle", async function () {
      const encryptedBalance = await shieldedToken.getEncryptedBalance(signers.alice.address);
      // Should return a non-zero handle (bytes32)
      expect(encryptedBalance).to.not.eq(ethers.ZeroHash);
    });

    it("should return zero handle for users with no balance", async function () {
      const encryptedBalance = await shieldedToken.getEncryptedBalance(signers.bob.address);
      expect(encryptedBalance).to.eq(ethers.ZeroHash);
    });
  });

  describe("Stealth Transfer via Announcer", function () {
    const TRANSFER_AMOUNT = 100n;

    beforeEach(async function () {
      // Shield tokens to alice first
      await mockToken.connect(signers.alice).approve(shieldedTokenAddress, SHIELD_AMOUNT);
      await shieldedToken.connect(signers.alice).shield(SHIELD_AMOUNT);
    });

    it("should perform stealth transfer and emit announcement", async function () {
      // Create encrypted input for transfer
      const encryptedInput = await fhevm
        .createEncryptedInput(shieldedTokenAddress, signers.alice.address)
        .add64(TRANSFER_AMOUNT)
        .encrypt();

      const ephemeralPubKeyX = ethers.zeroPadBytes("0x01", 32);
      const ephemeralPubKeyY = ethers.zeroPadBytes("0x02", 32);
      const ciphertext = ethers.toUtf8Bytes("encrypted-metadata");

      // Step 1: Perform shielded transfer directly to stealth user
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
          1,
          signers.stealthUser.address,
          shieldedTokenAddress,
          ephemeralPubKeyX,
          ephemeralPubKeyY,
          ciphertext
        );
    });

    it("should emit StealthTransferEncrypted event on direct transfer", async function () {
      // Create encrypted input
      const encryptedInput = await fhevm
        .createEncryptedInput(shieldedTokenAddress, signers.alice.address)
        .add64(TRANSFER_AMOUNT)
        .encrypt();

      // Direct stealth transfer (not via announcer)
      await expect(
        shieldedToken
          .connect(signers.alice)
          .stealthTransfer(
            signers.bob.address,
            encryptedInput.handles[0],
            encryptedInput.inputProof
          )
      )
        .to.emit(shieldedToken, "StealthTransferEncrypted")
        .withArgs(signers.alice.address, signers.bob.address);
    });

    it("should revert when recipient is zero address", async function () {
      const encryptedInput = await fhevm
        .createEncryptedInput(shieldedTokenAddress, signers.alice.address)
        .add64(TRANSFER_AMOUNT)
        .encrypt();

      await expect(
        shieldedToken
          .connect(signers.alice)
          .stealthTransfer(
            ethers.ZeroAddress,
            encryptedInput.handles[0],
            encryptedInput.inputProof
          )
      ).to.be.revertedWith("Invalid recipient");
    });
  });

  describe("Unshield (Token Withdrawal)", function () {
    const UNSHIELD_AMOUNT = ethers.parseUnits("100", 0); // 100 tokens (fits in uint64)

    beforeEach(async function () {
      // Shield tokens first
      await mockToken.connect(signers.alice).approve(shieldedTokenAddress, SHIELD_AMOUNT);
      await shieldedToken.connect(signers.alice).shield(SHIELD_AMOUNT);
    });

    it("should allow unshielding tokens", async function () {
      const balanceBefore = await mockToken.balanceOf(signers.alice.address);

      await expect(shieldedToken.connect(signers.alice).unshield(UNSHIELD_AMOUNT))
        .to.emit(shieldedToken, "Unshielded")
        .withArgs(signers.alice.address, UNSHIELD_AMOUNT);

      // Verify underlying tokens were returned
      const balanceAfter = await mockToken.balanceOf(signers.alice.address);
      expect(balanceAfter).to.equal(balanceBefore + UNSHIELD_AMOUNT);
    });

    it("should revert when unshielding zero amount", async function () {
      await expect(shieldedToken.connect(signers.alice).unshield(0))
        .to.be.revertedWith("Amount must be > 0");
    });

    it("should revert when unshielding amount exceeds uint64 max", async function () {
      const tooMuch = BigInt("18446744073709551616"); // 2^64
      await expect(shieldedToken.connect(signers.alice).unshield(tooMuch))
        .to.be.revertedWith("Amount exceeds uint64 max");
    });
  });
});
