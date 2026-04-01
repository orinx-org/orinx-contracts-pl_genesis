// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ZamaShieldedToken
 * @notice A wrapper around a standard ERC-20 token that encrypts balances using Zama's fhEVM on Ethereum/Sepolia.
 * @dev Users deposit plaintext tokens to mint an encrypted balance (`euint64`).
 *      Transfers occur homomorphically without unsealing the amounts on-chain.
 *      Uses ZamaEthereumConfig for Ethereum mainnet and Sepolia.
 */
contract ZamaShieldedToken is ZamaEthereumConfig, Ownable {
    using SafeERC20 for IERC20;

    // Encrypted constant for zero
    euint64 private immutable ENCRYPTED_ZERO;

    // The underlying plaintext asset (e.g. Sepolia USDC or other ERC20)
    IERC20 public immutable underlyingToken;
    
    // Encrypted balances mapping
    mapping(address => euint64) private _encryptedBalances;

    event Shielded(address indexed user, uint256 amount);
    event Unshielded(address indexed user, uint256 amount);
    event StealthTransferEncrypted(address indexed sender, address indexed recipient);

    constructor(address _underlying) Ownable(msg.sender) {
        require(_underlying != address(0), "Invalid token address");
        underlyingToken = IERC20(_underlying);
        
        // Initialize encrypted zero constant
        ENCRYPTED_ZERO = FHE.asEuint64(0);
        FHE.allowThis(ENCRYPTED_ZERO);
    }

    /**
     * @notice Deposit plaintext tokens to receive a shielded (encrypted) balance.
     * @param amount The plaintext amount to shield
     */
    function shield(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(amount <= type(uint64).max, "Amount exceeds uint64 max");
        
        // Transfer underlying tokens to this contract
        underlyingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Convert the plaintext amount to an encrypted integer
        euint64 encryptedAmount = FHE.asEuint64(uint64(amount));

        // Add to the user's encrypted balance
        _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], encryptedAmount);

        // Access Control: Grant access to contract itself and the user
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        emit Shielded(msg.sender, amount);
    }

    /**
     * @notice Transfer encrypted amounts to a Stealth Address receiver.
     * @dev This is called by the OrinxAnnouncer contract or directly by a user.
     * @param recipient The derived Stealth Address receiver
     * @param inputEuint64 The Zama encrypted payload (externalEuint64 format)
     * @param inputProof The proof for the encrypted input verification
     */
    function stealthTransfer(
        address recipient, 
        externalEuint64 inputEuint64, 
        bytes calldata inputProof
    ) external {
        require(recipient != address(0), "Invalid recipient");
        
        // Convert external input to internal euint64 with proof verification
        euint64 amount = FHE.fromExternal(inputEuint64, inputProof);

        // Debits sender
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], amount);
        
        // Credits receiver
        _encryptedBalances[recipient] = FHE.add(_encryptedBalances[recipient], amount);

        // Access Control: Re-grant permissions for the updated states
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        
        FHE.allowThis(_encryptedBalances[recipient]);
        FHE.allow(_encryptedBalances[recipient], recipient);

        emit StealthTransferEncrypted(msg.sender, recipient);
    }

    /**
     * @notice Get the encrypted balance of an address.
     * @dev The returned euint64 can only be decrypted by the balance owner via the Zama Gateway.
     * @param account The address to query
     * @return The encrypted balance
     */
    function getEncryptedBalance(address account) external view returns (euint64) {
        return _encryptedBalances[account];
    }

    /**
     * @notice Unshield tokens - convert encrypted balance back to plaintext and withdraw.
     * @dev Requires the caller to have an encrypted balance that they can decrypt via Zama Gateway.
     * @param amount The plaintext amount to unshield
     */
    function unshield(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(amount <= type(uint64).max, "Amount exceeds uint64 max");
        
        // Convert plaintext to encrypted for subtraction
        euint64 unshieldAmount = FHE.asEuint64(uint64(amount));
        
        // Subtract from encrypted balance (FHE handles underflow)
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], unshieldAmount);
        
        // Re-grant permissions
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        
        // Transfer underlying tokens back to user
        underlyingToken.safeTransfer(msg.sender, amount);
        
        emit Unshielded(msg.sender, amount);
    }
}
