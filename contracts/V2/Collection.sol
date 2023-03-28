// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collection is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address[] likedBy;

    mapping(uint256 => address[]) likedSomeNFTs;

    address _owner;
    string public _collectionHolderImage;
    string public _description;

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }
    
    modifier notAlreadyLike() {
        bool alreadyLiked = false;
        for (uint256 i = 0; i < likedBy.length; i++) {
            if (likedBy[i] == msg.sender) alreadyLiked = true;
        }
        require(!alreadyLiked);
        _;
    }

    modifier notAlreadyLikedNft(uint256 tokenId) {
        require(tokenId <= _tokenIds.current());
        bool alreadyLiked = false;
        for (uint256 i = 0; i < likedSomeNFTs[tokenId].length; i++) {
            if(likedSomeNFTs[tokenId][i] == msg.sender) alreadyLiked = true;
        }
        require(!alreadyLiked);
        _;
    }

    constructor(string memory collectionName, string memory collectionSymbol, string memory collectionImage, string memory description, address owner_) ERC721(collectionName, collectionSymbol) {
        _owner = owner_;
        _description = description;
        _collectionHolderImage = collectionImage;
    }
    
    function currentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(string memory tokenURI, address to) public payable returns (uint256) {
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _tokenIds.increment();
        return newTokenId;
    }

    function owner() public view returns(address) {
        return _owner;
    }

    function setCollectionImage(string memory url) onlyOwner public {
        _collectionHolderImage = url;
    }

    function transfer(address from, address to, uint256 tokenId) public {
        _transfer(from, to, tokenId);
    }

    function like() notAlreadyLike public {
        likedBy.push(msg.sender);
    }

    function likeNFT(uint256 tokenId_) notAlreadyLikedNft(tokenId_) public {
        likedSomeNFTs[tokenId_].push(msg.sender);
    }

    function getNFTsAllLiked(uint256 tokenId) public view returns (address[] memory) {
        return likedSomeNFTs[tokenId];
    }

    function getAllLiked() public view returns(address[] memory) {
        return likedBy;
    }
}

abstract contract CollectionHolder {
    using Counters for Counters.Counter;
    Counters.Counter _collectionIds;

    uint256 listingPrice;

    Collection[] collectionsArray;

    modifier inCollectionArray(address _address) {
        bool isIn = false;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (address(collectionsArray[i]) == _address) isIn = true;
        }
        require(isIn);
        _;
    }

    function collectionIdx(address _address) public view returns(uint256) {
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (address(collectionsArray[i]) == _address) return i;
        }
        return (_collectionIds.current() + 1);
    }

    function createCollection(string memory collectionName, string memory collectionSymbol, string memory collectionImage, string memory description) public {
        require(findCollection(msg.sender, collectionName) == (_collectionIds.current() + 1));
        Collection newCollection = new Collection(collectionName, collectionSymbol, collectionImage, description, msg.sender);
        collectionsArray.push(newCollection);
        _collectionIds.increment();
    }

    function getAllCollectionsAddresses() public view returns (address[] memory) {
        address[] memory collectionAddresses = new address[](_collectionIds.current());
        for (uint256 i = 0; i < _collectionIds.current(); i++){
            collectionAddresses[i] = address(collectionsArray[i]);
        }
        return collectionAddresses;
    }

    function getCollections(address owner_) public view returns (Collection[] memory) {
        uint256 size = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (collectionsArray[i].owner() == owner_) size += 1;
        }
        Collection[] memory myCollections = new Collection[](size);
        uint256 idx = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (collectionsArray[i].owner() == owner_) myCollections[idx] = collectionsArray[i];
            idx += 1;
        }
        return myCollections;
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

    function compare(string memory str1, string memory str2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
}