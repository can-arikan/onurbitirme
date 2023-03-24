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

    constructor(string memory _userName) UserHolder() CollectionHolder() MarketItemHolder() {
        listingPrice = 0.025 ether;
        createUser(_userName);
    }

    function marketOwner() public view returns(address) {
        return owner;
    }

    function setListingPrice(uint256 x) onlyOwner public {
        listingPrice = x;
    }

    function addExternalCollection(address x) onlyOwner public {
        collectionsArray.push(Collection(x));
    }
}