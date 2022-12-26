const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  it("Should return the new greeting once it's changed", async function () {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy("Hello, world!");
    await nftMarketplace.deployed();

    expect(await nftMarketplace.greet()).to.equal("Hello, world!");

    const setGreetingTx = await nftMarketplace.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await nftMarketplace.greet()).to.equal("Hola, mundo!");
  });
});
