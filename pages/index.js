import React, { useState, useEffect, useContext } from "react";

//internal import
import Style from "../styles/index.module.css";
import {HeroSection, AboutUs, BigNFTSlider, Title, Category, Filter, NFTCard, Collection, FollowerTab, Loader} from '../components/componentindex';
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import { getTopCreators } from "../TopCreators/TopCreators";


const Home = () => {
  const {checkIfWalletConnected} = useContext(NFTMarketplaceContext);
  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    // if (currentAccount) {
    fetchNFTs().then((items) => {
      console.log(nfts);
      if (items !== undefined) {
        setNfts(items.reverse());
        setNftsCopy(items);
      }
    });
    // }
  }, []);

  // creators list
  const creators = getTopCreators(nfts);
  // console.log(creators);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <AboutUs />
      <BigNFTSlider />
      <Title 
      heading="New Collections" 
      paragraph= "Collections make this marketplace even more entertaining! Check out the coolest collections available"
      />
      {creators.length == 0 ? (
        <Loader />
      ) : (
        <FollowerTab TopCreator={creators} />
      )}
      <Collection />
      <Title 
      heading="Featured NFTs" 
      paragraph= "Discover amazing NFTs"
      />
      <Filter />
      {nfts.length == 0 ? <Loader /> : <NFTCard NFTData={nfts} />}
      <Title 
      heading="Browse by category" 
      paragraph= "Explore NFTs from different categories"
      />
      <Category />
    </div>
  );
};

export default Home;