// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collection is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address _owner;

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    constructor(string memory collectionName, string memory collectionSymbol) ERC721(collectionName, collectionSymbol) {
        _owner = msg.sender;
    }
    
    function createToken(string memory tokenURI) onlyOwner public payable returns (uint256) {
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _tokenIds.increment();
        return newTokenId;
    }

    function owner() public view returns(address) {
        return _owner;
    }
}

abstract contract CollectionHolder {
    using Counters for Counters.Counter;
    Counters.Counter private _collectionIds;

    uint256 listingPrice;

    Collection[] collectionsArray;

    function createCollection(string memory collectionName, string memory collectionSymbol) public payable {
        require(_checkBalance(msg.value));
        require(findCollection(msg.sender, collectionName) == (_collectionIds.current() + 1));
        Collection newCollection = new Collection(collectionName, collectionSymbol);
        collectionsArray.push(newCollection);
        _collectionIds.increment();
    }

    function createToken(string memory collectionName, string memory tokenURI) public {
        uint256 collectionId = findCollection(msg.sender, collectionName);
        require(collectionId <= _collectionIds.current());
        Collection collection = collectionsArray[collectionId];
        collection.createToken(tokenURI);
    }

    function findCollection(address _owner, string memory collectionName) public view returns(uint256) {
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (collectionsArray[i].owner() == _owner && compare(collectionsArray[i].name(), collectionName)) return i;
        }
        return (_collectionIds.current() + 1);
    }
    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    function _checkBalance(uint256 payedAmount) private view returns (bool) {
        return payedAmount >= listingPrice;
    }

    function compare(string memory str1, string memory str2) private pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
}