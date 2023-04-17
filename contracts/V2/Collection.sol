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
    string[] categories;

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

    constructor(string memory collectionName, string memory collectionSymbol, string memory collectionImage, string memory description, address owner_, string[] memory category) ERC721(collectionName, collectionSymbol) {
        _owner = owner_;
        _description = description;
        _collectionHolderImage = collectionImage;
        categories = category;
        _owner = msg.sender;
    }

    function getCategory() onlyOwner public view returns (string[] memory) {
        return categories;
    }

    function setCategory(string[] memory cat) onlyOwner public {
        categories = cat;
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
    string[] availableCategories;
    
    Collection[] collectionsArray;

    struct CollectionJSON {
        string collectionName;
        address collectionAddress;
        string collectionImage;
        string collectionDescription;
        uint256 collectionLikesCount;
        address collectionOwner;
        uint256 collectionNftLikes;
    }

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

    function createCollection(string memory collectionName, string memory collectionSymbol, string memory collectionImage, string memory description, string[] memory categories) public payable {
        require(findCollection(msg.sender, collectionName) == (_collectionIds.current() + 1));
        require(_checkBalance(msg.value));
        require(checkCategories(categories));
        Collection newCollection = new Collection(collectionName, collectionSymbol, collectionImage, description, msg.sender, categories);
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

    function getCollections(address owner_) public view returns (CollectionJSON[] memory) {
        uint256 size = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (collectionsArray[i].owner() == owner_) size += 1;
        }
        CollectionJSON[] memory myCollections = new CollectionJSON[](size);
        uint256 idx = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (collectionsArray[i].owner() == owner_) {
                uint256 totalNftLikes = 0;
                for (uint256 j = 0; j < collectionsArray[i].currentTokenId(); j++) {
                    totalNftLikes += collectionsArray[i].getNFTsAllLiked(j).length;
                }
                myCollections[idx] = CollectionJSON({
                    collectionName: collectionsArray[i].name(),
                    collectionAddress: address(collectionsArray[i]),
                    collectionImage: collectionsArray[i]._collectionHolderImage(),
                    collectionDescription: collectionsArray[i]._description(),
                    collectionLikesCount: collectionsArray[i].getAllLiked().length,
                    collectionOwner: collectionsArray[i].owner(),
                    collectionNftLikes: totalNftLikes
                });
                idx += 1;
            }
        }
        return myCollections;
    }

    function findCollection(address owner_, string memory collectionName) public view returns(uint256) {
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            if (collectionsArray[i].owner() == owner_ && compare(collectionsArray[i].name(), collectionName)) return i;
        }
        return (_collectionIds.current() + 1);
    }
    
    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    function compare(string memory str1, string memory str2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function checkCategories(string[] memory categories) private view returns (bool) {
        for (uint256 i = 0; i < categories.length; i++) {
            if (!isInListStrStr(categories[i], availableCategories)) return false;
        }
        return true;
    }

    function isInListStrStr(string memory str, string[] memory lst) private pure returns (bool) {
        for (uint256 i = 0; i < lst.length; i++) {
            if (compare(lst[i], str)) return true;
        }
        return false;
    }

    function _checkBalance(uint256 price) private view returns (bool) {
        return getListingPrice() <= price;
    }
}