import { expect } from "chai";
import { ethers } from "hardhat";
import { OrinxRegistry, OrinxAnnouncer } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Orinx Protocol", function () {
    let registry: OrinxRegistry;
    let announcer: OrinxAnnouncer;
    let owner: SignerWithAddress;
    let otherAccount: SignerWithAddress;

    beforeEach(async function () {
        [owner, otherAccount] = await ethers.getSigners();

        const OrinxRegistryFactory = await ethers.getContractFactory("OrinxRegistry");
        registry = (await OrinxRegistryFactory.deploy()) as unknown as OrinxRegistry;

        const OrinxAnnouncerFactory = await ethers.getContractFactory("OrinxAnnouncer");
        announcer = (await OrinxAnnouncerFactory.deploy()) as unknown as OrinxAnnouncer;
    });

    describe("OrinxRegistry", function () {
        it("Should register a username", async function () {
            const username = "alice";
            const metaAddress = ethers.toUtf8Bytes("meta-address-mock-data");

            await expect(registry.registerUsername(username, metaAddress))
                .to.emit(registry, "UsernameRegistered")
                .withArgs(username, owner.address, metaAddress);

            expect(await registry.usernameOwners(username)).to.equal(owner.address);
        });

        it("Should revert if username is taken", async function () {
            const username = "bob";
            const metaAddress = ethers.toUtf8Bytes("meta-address-1");

            await registry.registerUsername(username, metaAddress);

            const metaAddress2 = ethers.toUtf8Bytes("meta-address-2");
            await expect(registry.registerUsername(username, metaAddress2))
                .to.be.revertedWithCustomError(registry, "UsernameTaken");
        });
    });

    describe("OrinxAnnouncer", function () {
        it("Should emit Announcement event", async function () {
            const schemeId = 1;
            const stealthAddress = otherAccount.address;
            const ephemeralPubKeyX = ethers.randomBytes(32);
            const ephemeralPubKeyY = ethers.randomBytes(32);
            const ciphertext = ethers.toUtf8Bytes("ciphertext");

            // Send some FLOW
            const amount = ethers.parseEther("0.1");

            await expect(announcer.sendStealth(
                ephemeralPubKeyX,
                ephemeralPubKeyY,
                ciphertext,
                stealthAddress as unknown as any, // casting for type matching if needed
                { value: amount }
            ))
                .to.emit(announcer, "Announcement")
                .withArgs(schemeId, stealthAddress, ephemeralPubKeyX, ephemeralPubKeyY, ciphertext);
        });
    });
});
