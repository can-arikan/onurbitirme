// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _nftId) external;
    function ownerOf(uint256 _tokenId) external view returns (address);
}

contract Auction{
    uint256 private constant DURATION = 7 days;

    IERC721 public nft;
    uint256 public nftId;

    address payable public seller;
    address payable public buyer;
    uint256 public startingPrice;
    uint256 public discountRate;
    uint256 public startAt;
    uint256 public expireAt;
    bool public closed;
    bool public sold;

    // constructor
    constructor(
        uint256 _startingPrice,
        uint256 _discountRate,
        address _nft,
        uint256 _nftId
    ) {
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        discountRate = _discountRate;
        startAt = block.timestamp;
        expireAt = block.timestamp + DURATION;
        closed = false;
        sold = false;

        require(_startingPrice >= _discountRate + DURATION, "Starting price is too low");
        nft = IERC721(_nft);
        require(nft.ownerOf(_nftId) == msg.sender, "You do not own this NFT");
        nftId = _nftId;
    }

    function getPrice() public view returns(uint256){
        require(block.timestamp < expireAt && !closed, "Auction for this NFT ended");
        uint256 timeElapsed = block.timestamp - startAt;
        uint256 discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function buy() public payable{
        require(block.timestamp < expireAt && !closed && !sold, "Auction for this NFT ended or already sold");
        require(nft.ownerOf(nftId) == seller, "The NFT has already been sold");
        require(msg.value >= getPrice(), "The ETH sent is less than the price");
        buyer = payable(msg.sender);
        nft.transferFrom(seller, buyer, nftId);
        closed = true;
        sold = true;
    }

    function close() public{
        require(msg.sender == seller && block.timestamp > expireAt && !closed, "Auction is not expired or already closed");
        closed = true;
    }

    function refund() public{
        require(msg.sender == buyer && closed && !sold, "Auction is still open or NFT has been sold");
        require(address(this).balance > 0, "Contract has no balance to refund");
        buyer.transfer(address(this).balance);
    }
}
