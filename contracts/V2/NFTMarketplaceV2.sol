// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./User.sol";
import "./Collection.sol";
import "./MarketItem.sol";

contract NFTMarketplaceV2 is UserHolder, CollectionHolder, MarketItemHolder {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(string memory _userName, string memory email, string memory pictureUri) UserHolder() CollectionHolder() MarketItemHolder() {
        listingPrice = 0.025 ether;
        createUser(_userName, email, pictureUri);
        owner = msg.sender;
    }

    function marketOwner() public view returns(address) {
        return owner;
    }

    function setListingPrice(uint256 x) onlyOwner public {
        listingPrice = x;
    }

    function addExternalCollection(address x) onlyOwner public {
        collectionsArray.push(Collection(x));
        _collectionIds.increment();
    }

    function deposit() onlyOwner public payable {
        payable(msg.sender).transfer(address(this).balance);
    }

    function createToken(address collectionAddress, string memory tokenURI) inCollectionArray(collectionAddress) public returns (uint256, uint256) {
        Collection collection = Collection(collectionAddress);
        require(msg.sender == collection.owner());
        return (collection.createToken(tokenURI, msg.sender), collectionIdx(collectionAddress));
    }

    function createMarketToken(address collectionAddress, string memory tokenUri, uint256 price) public payable returns(uint256 tokenId, uint256 collectionId){
        (uint256 newTokenId, uint256 collectionIdx) = createToken(collectionAddress, tokenUri);
        createMarketItem(collectionAddress, newTokenId, price, msg.sender);
        
        return (newTokenId, collectionIdx);
    }

    function createMarketItem(address collectionAddress, uint256 tokenId, uint256 price, address owner_) public payable {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        idToMarketItem[_tokenIds.current()] = MarketItem(
            collectionAddress,
            Collection(collectionAddress).name(),
            Collection(collectionAddress)._description(),
            tokenId,
            payable(owner_),
            payable(address(this)),
            price,
            false
        );
        _tokenIds.increment();
        Collection collection = Collection(collectionAddress);
        collection.transfer(msg.sender, address(this), tokenId);
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) override public payable {
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        Collection collection = Collection(idToMarketItem[tokenId].collection_address);
        collection.transfer(msg.sender, address(this), tokenId);
    }

    function createMarketSale(uint256 tokenId) override public payable {
        uint256 price = idToMarketItem[tokenId].price;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        _itemsSold.increment();
        Collection(idToMarketItem[tokenId].collection_address).transfer(address(this), msg.sender, tokenId);
        payable(idToMarketItem[tokenId].seller).transfer(msg.value);
        idToMarketItem[tokenId].seller = payable(address(0));
    }
    
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i].owner == address(this)) {
                MarketItem storage currentItem = idToMarketItem[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                MarketItem storage currentItem = idToMarketItem[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    function getUserLikedCollections(address user) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            for (uint256 j = 0; j < collectionsArray[i].getAllLiked().length; j++) {
                if (collectionsArray[i].getAllLiked()[j] == user) count += 1;
            }
        }
        return count;
    }

    function getUserLikedNFTs(address user) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            Collection currentCollection = collectionsArray[i];
            for (uint256 j = 0; j < currentCollection.currentTokenId(); j++) {
                address[] memory nftLikeds = currentCollection.getNFTsAllLiked(j);
                for (uint256 k = 0; k < nftLikeds.length; k++) {
                    if (nftLikeds[k] == user) count += 1;
                }
            }
        }
        return count;
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                MarketItem storage currentItem = idToMarketItem[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    function fetchAllMarketItems() public view returns (MarketItem[] memory) { 
        MarketItem[] memory items = new MarketItem[](_tokenIds.current());
        for (uint256 i = 0; i < _tokenIds.current(); i++) {
            items[i] = idToMarketItem[i];
        }
        return items;
    }

    function getMarketItemCount() public view returns(uint256) {
        return _tokenIds.current();
    }

    function getCollectionCount() public view returns(uint256) {
        return _collectionIds.current();
    }

    function getCollectionNftCount(uint256 collectionId) public view returns(uint256) {
        return collectionsArray[collectionId].currentTokenId();
    }
}