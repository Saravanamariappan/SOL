// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract CollegeDonation{
    address public owner;
    constructor(){
        owner=msg.sender;

    }
    uint public totalamount;
    modifier onlyowner(){
        require(msg.sender==owner,"Only owner can call this funtion");
        _;
    }

    function donate() public payable{
        totalamount+=msg.value;
    }
    function reset() public onlyowner{
        totalamount=0;
    }
}