// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract OwnerOnly {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can access");
        _;
    }

    function accessOwner() public view onlyOwner returns (string memory) {
        return "Owner accessed successfully";
    }
}