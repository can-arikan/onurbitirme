require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    //   hardhat: {},

    polygon_mumbai: {
      // chainId: 80001,
      url: "https://polygon-mumbai.g.alchemy.com/v2/OoInLrxpGqo3lRRQSMEhuBLh-mecRUBQ",
      // url: process.env.POLYGON_MUMBAI,
      accounts: [
        `0x${"5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"}`,
      ],
    },
  },
};
