// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title OrinxRegistry
 * @notice Immutable Identity Registry for Orinx Stealth IDs.
 * @dev Maps Usernames to Stealth Meta-Addresses with Ownership rights.
 *      Features:
 *      - Username Verification (Unique Names).
 *      - Identity Uniqueness (One Stealth ID = One Name).
 *      - Ownership (msg.sender owns the name).
 *      - Key Rotation (Owner can update stealth keys).
 *      - Transferability (Owner can move name to new wallet).
 */
contract OrinxRegistry {
    
    // --- Events ---
    event UsernameRegistered(string indexed username, address indexed owner, bytes metaAddress);
    event UsernameTransferred(string indexed username, address indexed newOwner);
    event StealthKeysUpdated(string indexed username, bytes newMetaAddress);

    // --- Errors ---
    error UsernameTaken();
    error UsernameTooShort();
    error IdentityAlreadyRegistered();
    error Unauthorized();
    error InvalidInput();

    // --- State ---
    
    // Mapping: Username -> Stealth Meta-Address (Public Keys)
    mapping(string => bytes) public usernames;

    // Mapping: Username -> Owner Address (The Wallet that controls the name)
    mapping(string => address) public usernameOwners;
    
    // Mapping: Keccak(Meta-Address) -> Username
    // Enforces strict 1-to-1 mapping to prevent spam/squatting with same keys.
    mapping(bytes32 => string) public metaHashToUsername;

    /**
     * @notice Registers a new Username for a Stealth Meta-Address using msg.sender as owner.
     * @param username The desired unique username (e.g. "alice").
     * @param metaAddress The component keys (Spending Pub + Viewing Pub).
     */
    function registerUsername(string calldata username, bytes calldata metaAddress) external {
        // 1. Validation
        if (usernameOwners[username] != address(0)) revert UsernameTaken();
        if (bytes(username).length <= 2) revert UsernameTooShort();
        if (metaAddress.length == 0) revert InvalidInput();
        
        // 2. Uniqueness Check (Prevents reusing same stealth keys for multiple names)
        bytes32 metaHash = keccak256(metaAddress);
        if (bytes(metaHashToUsername[metaHash]).length > 0) revert IdentityAlreadyRegistered();

        // 3. Storage
        usernameOwners[username] = msg.sender;
        usernames[username] = metaAddress;
        metaHashToUsername[metaHash] = username;

        emit UsernameRegistered(username, msg.sender, metaAddress);
    }

    /**
     * @notice Allows the owner to rotate their stealth keys (e.g. if compromised).
     * @param username The username to update.
     * @param newMetaAddress The new stealth keys.
     */
    function updateStealthKeys(string calldata username, bytes calldata newMetaAddress) external {
        // 1. Auth
        if (usernameOwners[username] != msg.sender) revert Unauthorized();
        if (newMetaAddress.length == 0) revert InvalidInput();

        // 2. Check new keys uniqueness
        bytes32 newHash = keccak256(newMetaAddress);
        // Allow updating to SAME keys (redundant but safe), but not to keys used by ANOTHER user.
        string memory existingOwnerOfKeys = metaHashToUsername[newHash];
        if (bytes(existingOwnerOfKeys).length > 0) {
            // If keys are used by someone else, revert. 
            // If keys are used by THIS username (same keys), it's fine.
            if (keccak256(bytes(existingOwnerOfKeys)) != keccak256(bytes(username))) {
                revert IdentityAlreadyRegistered();
            }
        }

        // 3. Clean up Old Reverse Mapping
        bytes memory oldKeys = usernames[username];
        bytes32 oldHash = keccak256(oldKeys);
        delete metaHashToUsername[oldHash];

        // 4. Update
        usernames[username] = newMetaAddress;
        metaHashToUsername[newHash] = username;

        emit StealthKeysUpdated(username, newMetaAddress);
    }

    /**
     * @notice Transfer ownership of a username to a new wallet.
     * @param username The name to transfer.
     * @param newOwner The address of the new controller.
     */
    function transferUsername(string calldata username, address newOwner) external {
        if (usernameOwners[username] != msg.sender) revert Unauthorized();
        if (newOwner == address(0)) revert InvalidInput();

        usernameOwners[username] = newOwner;
        
        emit UsernameTransferred(username, newOwner);
    }
}
