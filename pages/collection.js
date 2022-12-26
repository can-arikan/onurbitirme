import React, { useState, useEffect, useContext } from "react";

// internal import
import Style from "../styles/collection.module.css";
import images from "../img";
import {
  Banner,
  CollectionProfile,
  NFTCardTwo,
  Loader,
} from "../collectionPage/collectionIndex";
// import { Slider, Brand } from "../components/componentsindex";
import Filter from "../components/Filter/Filter";

// import smart contract data
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const collection = () => {
  const collectionArray = [
    images.nft_image_1,
    images.nft_image_2,
    images.nft_image_3,
    images.nft_image_1,
    images.nft_image_2,
    images.nft_image_3,
    images.nft_image_1,
    images.nft_image_2,
  ];

  // add <Slider />
  //    <Brand />
  return (
    <div className={Style.collection}>
      <Banner bannerImage={images.creatorbackground1} />
      <CollectionProfile />
      <Filter />
      <NFTCardTwo NFTData={collectionArray} />
    </div>
  );
};

export default collection;