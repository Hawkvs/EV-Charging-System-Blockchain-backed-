// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal stub used only for local/off-chain simulation tests.
contract DummyEscrowPayment {
    event DummyPaymentReleased(uint256 indexed requestId, address indexed caller);

    function paymentrelease(uint256 requestId) external {
        emit DummyPaymentReleased(requestId, msg.sender);
    }
}
