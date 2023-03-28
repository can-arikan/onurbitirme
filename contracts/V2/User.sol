// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";



abstract contract UserHolder {
    struct User {
        string userName;
        string profilePicture;
        string email;
    }
    
    mapping(address => User) users;
    address[] userAddresses;

    function createUser(string memory name, string memory emailAddress, string memory pictureUri) public {
        require(doesAddressExists(msg.sender) == false);
        users[msg.sender].userName = name;
        users[msg.sender].profilePicture = pictureUri;
        users[msg.sender].email = emailAddress;
        userAddresses.push(msg.sender);
    }
    function updateUserName(string memory name) public {
        require(doesAddressExists(msg.sender));
        users[msg.sender].userName = name;
    }
    function updateUserPicture(string memory pictureUri) public {
        require(doesAddressExists(msg.sender));
        users[msg.sender].userName = pictureUri;
    }
    function updateUserEmail(string memory emailAddress) public {
        require(doesAddressExists(msg.sender));
        users[msg.sender].userName = emailAddress;
    }
    function getUser(address user) public view returns(User memory){
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