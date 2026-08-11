// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract StudentMangement{
    address public owner;
    constructor(){
        owner=msg.sender;
    }
        enum Status{
            ACTIVE,
            INACTIVE,
            REMOVED,
            GRADUATED
        }
    struct student{
        string name;
        uint age;
        uint marks;
        Status status;
        
    }
    mapping(uint=>student) public Students;



    function addStudnet(uint id,string memory _name,uint _age,uint _marks) public{
        Students[id]=student(_name,_age,_marks,Status.ACTIVE);
    }
    function graduated(uint id) public{
        require(msg.sender==owner,"Only owner can change the status");
        Students[id].status=Status.GRADUATED;
    }

    


}
