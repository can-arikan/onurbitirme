
const hre = require("hardhat");
//const ethers = require("ethers");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  //const deployer = await hre.ethers.getSigners()[0];
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const NFTMarketplaceDeployer = await hre.ethers.getSigner(NFTMarketplace.address);
  

  const nftMarketplace = await NFTMarketplace.deploy();

  console.log("Deploying contracts with the account:", NFTMarketplaceDeployer.address);

  await nftMarketplace.deployed();

  console.log("NFTMarketplace deployed to:", nftMarketplace.address);
  //console.log("NFTMarketplace deployed by following address:", nftMarketplace.owner());

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
