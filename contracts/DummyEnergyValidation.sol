// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDummyEscrow {
    function paymentrelease(uint256 _requestId) external;
}

/// @notice Minimal validation stub for simulation; bypasses real checks.
contract DummyEnergyValidation {
    IDummyEscrow public escrow;

    event Started(uint256 indexed requestId);
    event Completed(uint256 indexed requestId, uint256 energy);

    constructor(address _escrow) {
        escrow = IDummyEscrow(_escrow);
    }

    function setEscrow(address _escrow) external {
        escrow = IDummyEscrow(_escrow);
    }

    function started(uint256 _requestId) external {
        emit Started(_requestId);
    }

    function completed(uint256 _requestId, uint256 _energy) external {
        emit Completed(_requestId, _energy);
        // Simulate payout
        escrow.paymentrelease(_requestId);
    }
}
