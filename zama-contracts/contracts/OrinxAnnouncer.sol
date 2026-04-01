// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

// Interface for Zama shielded token
interface IZamaShieldedToken {
    function stealthTransfer(address recipient, externalEuint64 inputEuint64, bytes calldata inputProof) external;
}

/**
 * @title OrinxAnnouncer
 * @notice Statutory Stateless Event Emitter for Orinx Stealth Payments.
 * @dev Features:
 *      - Broadcasts "Announcement" events for scanning.
 *      - Protocol Fee Mechanism (Configurable BPS).
 *      - Emergency Pause (Pausable).
 *      - ReentrancyGuard for ETH safety.
 *      - Zama FHE Support for Sepolia (chainId: 11155111).
 */
contract OrinxAnnouncer is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Events ---
    event Announcement(
        uint256 indexed schemeId,
        address indexed stealthAddress,
        bytes32 ephemeralPubKeyX,
        bytes32 ephemeralPubKeyY,
        bytes ciphertext
    );

    event ERC20Announcement(
        uint256 indexed schemeId,
        address indexed stealthAddress,
        address indexed token,
        uint256 amount,
        bytes32 ephemeralPubKeyX,
        bytes32 ephemeralPubKeyY,
        bytes ciphertext
    );

    event ShieldedAnnouncement(
        uint256 indexed schemeId,
        address indexed stealthAddress,
        address indexed token,
        bytes32 ephemeralPubKeyX,
        bytes32 ephemeralPubKeyY,
        bytes ciphertext
    );

    event FeeUpdated(uint16 newFeeBps);
    event FeeReceiverUpdated(address newReceiver);

    // --- Errors ---
    error InvalidTarget();
    error InvalidFee(); // Max 5%
    error NothingToWithdraw();

    // --- State ---
    uint16 public feeBps; // Basis Points: 100 = 1%. Max 500 (5%).
    address public feeReceiver;

    // Constant for BPS calculations
    uint256 private constant DENOMINATOR = 10000;

    constructor() Ownable(msg.sender) {
        feeReceiver = msg.sender;
        feeBps = 0; // Start with 0 fees
    }

    // --- Admin (Ownable) ---

    function setFee(uint16 _bps) external onlyOwner {
        if (_bps > 500) revert InvalidFee(); // Cap at 5% for trust
        feeBps = _bps;
        emit FeeUpdated(_bps);
    }

    function setFeeReceiver(address _receiver) external onlyOwner {
        if (_receiver == address(0)) revert InvalidTarget();
        feeReceiver = _receiver;
        emit FeeReceiverUpdated(_receiver);
    }

    function togglePause() external onlyOwner {
        paused() ? _unpause() : _pause();
    }

    /**
     * @notice Withdraw accumulated fees or stuck tokens (Rescue).
     */
    function withdrawFees(address token) external onlyOwner {
        if (token == address(0)) {
            // ETH
            uint256 balance = address(this).balance;
            if (balance == 0) revert NothingToWithdraw();
            (bool sent, ) = feeReceiver.call{value: balance}("");
            require(sent, "ETH Withdraw Failed");
        } else {
            // ERC20
            uint256 balance = IERC20(token).balanceOf(address(this));
            if (balance == 0) revert NothingToWithdraw();
            IERC20(token).safeTransfer(feeReceiver, balance);
        }
    }

    // --- Core Logic ---

    /**
     * @notice Sends ETH to a stealth address and emits announcement.
     * @dev Takes Protocol Fee from msg.value if applicable.
     */
    function sendStealth(
        bytes32 x, 
        bytes32 y, 
        bytes calldata ciphertext, 
        address payable target
    ) external payable whenNotPaused nonReentrant {
        if (target == address(0)) revert InvalidTarget();
        
        uint256 amount = msg.value;
        require(amount > 0, "No funds sent");

        // Fee Logic
        if (feeBps > 0) {
            uint256 fee = (amount * feeBps) / DENOMINATOR;
            amount -= fee;
            // Fee stays in contract, withdrawable by owner
        }

        // Forward Remainder
        (bool sent, ) = target.call{value: amount}("");
        require(sent, "ETH transfer failed");

        emit Announcement(1, target, x, y, ciphertext);
    }

    /**
     * @notice Sends ERC20 tokens to a stealth address and emits announcement.
     * @dev Requires Approval. Fee is collected separately, full amount goes to stealth address.
     */
    function sendERC20Stealth(
        address token,
        uint256 amount,
        address stealthAddress,
        bytes32 x,
        bytes32 y,
        bytes calldata ciphertext
    ) external whenNotPaused {
        if (token == address(0)) revert InvalidTarget();
        if (stealthAddress == address(0)) revert InvalidTarget();
        require(amount > 0, "No tokens sent");

        // Fee Logic: Collect fee separately from sender, full amount goes to stealth
        if (feeBps > 0) {
            uint256 fee = (amount * feeBps) / DENOMINATOR;
            
            // Transfer Fee: Sender -> Contract (for later withdrawal)
            if (fee > 0) {
                IERC20(token).safeTransferFrom(msg.sender, address(this), fee);
            }
        }

        // Transfer Full Amount: Sender -> Stealth Address
        IERC20(token).safeTransferFrom(msg.sender, stealthAddress, amount);

        emit ERC20Announcement(1, stealthAddress, token, amount, x, y, ciphertext);
    }

    /**
     * @notice Emits a ShieldedAnnouncement event for a Zama FHE shielded transfer.
     * @dev The actual shielded transfer must be done directly by the sender to the ZamaShieldedToken
     *      contract BEFORE calling this function. FHE encrypted inputs are bound to the signer,
     *      so proxy patterns like the announcer cannot perform the transfer.
     * @param shieldedToken The ZamaShieldedToken contract address that was used for the transfer
     * @param stealthAddress The stealth address that received the encrypted tokens
     * @param x Ephemeral public key X coordinate
     * @param y Ephemeral public key Y coordinate  
     * @param ciphertext Encrypted metadata for recipient
     */
    function announceShieldedStealth(
        address shieldedToken,
        address stealthAddress,
        bytes32 x,
        bytes32 y,
        bytes calldata ciphertext
    ) external whenNotPaused {
        if (shieldedToken == address(0)) revert InvalidTarget();
        if (stealthAddress == address(0)) revert InvalidTarget();

        emit ShieldedAnnouncement(1, stealthAddress, shieldedToken, x, y, ciphertext);
    }
}
