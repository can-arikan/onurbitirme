import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const projectId = "2Jon4maffYPwCaDN50S8s1W2GKN";
const projectSecretKey = "ba90443414921035ac1eff94fe58db5c";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const subdomain = "https://main-sunft.infura-ipfs.io";

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  },
  mode: 'no-cors',
});

// internal import (abi and address from constants)
import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

// fetch smart contract
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

// connect with smart contract
const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();  // whoever gets the contract will be the signer
    const contract = fetchContract(signer);
    console.log(contract);
    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with contract");
  }
};

// using provider will be available in the entire application
export const NFTMarketplaceContext = React.createContext();
export const NFTMarketplaceProvider = (({ children }) => {
  const titleData = "Welcome to SUNFT!";
  // usestat: whoever contacts with the smart contract, get their wallet address
  const [currentAccount, setCurrentAccount] = useState("");
  const router = useRouter();

  // function to check whether wallet is connected or not
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return console.log("Install metamask");
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("Something went wrong while connecting to wallet");
    }
  };
  // function to connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return console.log("Install metamask");
      // Request user's permission to connect to their wallet
      // Request user's permission to connect to their wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      // window.location.reload();
    } catch (error) {
      console.log("Error while connecting to wallet");
    }
  };
  const disconnectWallet = async () => {
    // Disconnect the user's wallet
    //await window.ethereum.request({ method: 'eth_close' });
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [{ eth_accounts: {} }]
    })
    // Set the account state variable to null, which will log the user out
    setCurrentAccount(null);
  };


  // upload to ipfs function
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading to IPFS", (error));
    }
  };

  // function to create nft
  const createNFT = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image) return console.log("Data is missing");
    const data = JSON.stringify({ name, description, image });
    try {
      const added = await client.add(data);
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      await createSale(url, price);
      //router.push("/searchPage");
    } catch (error) {
      console.log("Error while creating NFT");
      console.log(error);
    }
  };

  // createSale function in createNFT function
  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      console.log(url, formInputPrice, isReselling, id);
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      console.log(price); // to check if we get the price right
      const contract = await connectingWithSmartContract();
      const listingPrice = await contract.getListingPrice();
      console.log(listingPrice);

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
          value: listingPrice.toString(),
        })
        : await contract.resellToken(id, price, {
          value: listingPrice.toString(),
        });

      await transaction.wait();

    } catch (error) {
      console.log("error while creating sale", (error));
    }
  };

  const checkWhitelist = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const contract = await connectingWithSmartContract();
      const isWhitelisted = await contract.isWhitelisted(accounts[0]);
      console.log(isWhitelisted);

      return isWhitelisted;

    } catch (error) {
      console.log("error while checking whitelist", (error));
    }
  };

  // function to fetch nfts
  const fetchNFTs = async () => {
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();
      console.log(data);

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get('https://cors-anywhere.herokuapp.com/' + tokenURI, {

            });
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      // console.log(items);
      return items;
    } catch (error) {
      console.log("Error while fetching nft");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  // function to fetch my nft or listed nfts
  const fetchMyNFTsOrListedNFTs = async (type) => {
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    try {
      const contract = await connectingWithSmartContract();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get('https://cors-anywhere.herokuapp.com/' + tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.log("Error while fetching listed NFTs");
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  // function to buy nfts
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
      router.push("/author");
    } catch (error) {
      console.log("Error while buying NFT");
    }
  };
  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        connectWallet,
        disconnectWallet,
        uploadToIPFS,
        createNFT,
        createSale,
        checkWhitelist,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        currentAccount,
        titleData,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
});