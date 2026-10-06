// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract OwnerOnly {

    address public owner;

    mapping(address => bool) public users;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can access");
        _;
    }

    modifier onlyUser() {
        require(users[msg.sender], "User is not registered");
        _;
    }

    function addUser(address user) public onlyOwner {
        users[user] = true;
    }

    function removeUser(address user) public onlyOwner {
        users[user] = false;
    }

    function accessUser()
        public
        view
        onlyUser
        returns (string memory)
    {
        return "User accessed successfully";
    }
}