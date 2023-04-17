// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

    constructor(
        string memory _userName,
        string memory email,
        string memory pictureUri
    ) UserHolder() CollectionHolder() MarketItemHolder() {
        listingPrice = 0.025 ether;
        createUser(_userName, email, pictureUri);
        owner = msg.sender;
    }

    function createToken(address collectionAddress, string memory tokenUri) public {
        Collection(collectionAddress).createToken(tokenUri, msg.sender);
    }

    function createMarketToken(
        address collectionAddress,
        uint256 tokenId,
        uint256 price
    )
        public 
        inCollectionArray(collectionAddress)
        payable
    {
        require(price > 0);
        require(msg.value == listingPrice);
        Collection(collectionAddress).transfer(msg.sender, address(this), tokenId);
        idToMarketItem[_tokenIds.current()] = MarketItem(
            collectionAddress,
            Collection(collectionAddress).name(),
            Collection(collectionAddress)._description(),
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        _tokenIds.increment();
    }

    function createMarketSale(uint256 tokenId) public payable override {
        MarketItem storage mi = idToMarketItem[tokenId];
        uint256 price = mi.price;
        require(msg.value >= price);
        mi.owner = payable(msg.sender);
        mi.sold = true;
        _itemsSold.increment();
        Collection(mi.collection_address).transfer(
            address(this),
            msg.sender,
            tokenId
        );
        payable(mi.seller).transfer(price);
    }

    function fetchParams(address who) private view returns (uint256, uint256, uint256) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].owner == who) {
                itemCount += 1;
            }
        }
        return (totalItemCount, itemCount, currentIndex); 
    }

    function fetchMyNFTs(address who) public view returns (MarketItem[] memory) {
        (uint256 totalItemCount, uint256 itemCount, uint256 currentIndex) = fetchParams(who);
        
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].owner == who) {
                MarketItem storage currentItem = idToMarketItem[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyListedItems(address who) public view returns (MarketItem[] memory) {
        (uint256 totalItemCount, uint256 itemCount, uint256 currentIndex) = fetchParams(who);
        
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].seller == who) {
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

    function setCategories(string[] memory categories, string[] memory f_pictures, string[] memory b_pictures)
        public
        override
        onlyOwner
    {
        availableCategories = categories;
        categoryFrontPictures = f_pictures;
        categoryBackgroundPictures = b_pictures;
    }

    function marketOwner() public view returns (address) {
        return owner;
    }

    function setListingPrice(uint256 x) public onlyOwner {
        listingPrice = x;
    }

    function deposit() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getUserLikedCollections(address user)
        public
        view
        returns (uint256)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            address[] memory likes = collectionsArray[i].getAllLiked();
            for (
                uint256 j = 0;
                j < likes.length;
                j++
            ) {
                if (likes[j] == user) count += 1;
            }
        }
        return count;
    }

    function getUserLikedNFTs(address user) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            Collection currentCollection = collectionsArray[i];
            for (uint256 j = 0; j < currentCollection.currentTokenId(); j++) {
                address[] memory nftLikeds = currentCollection.getNFTsAllLiked(
                    j
                );
                for (uint256 k = 0; k < nftLikeds.length; k++) {
                    if (nftLikeds[k] == user) count += 1;
                }
            }
        }
        return count;
    }

    function getMarketItemCount() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getCollectionCount() public view returns (uint256) {
        return _collectionIds.current();
    }

    function getCollectionNftCount(uint256 collectionId)
        public
        view
        returns (uint256)
    {
        return collectionsArray[collectionId].currentTokenId();
    }
}
