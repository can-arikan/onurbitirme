// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract UserHolder {
    mapping(address => string) users;
    address[] userAddresses;

    function createUser(string memory name) public {
        require(doesAddressExists(msg.sender) == false);
        users[msg.sender] = name;
    }
    function updateUser(string memory name) public {
        require(doesAddressExists(msg.sender));
        users[msg.sender] = name;
    }
    function userName(address user) public view returns(string memory){
        require(doesAddressExists(user));
        return users[user];
    }
    function doesAddressExists(address x) private view returns(bool){
        for (uint256 i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i] == x) return true;
        }
        return false;
    }
}