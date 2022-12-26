import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";

// internal import
import Style from "./HeroSection.module.css";
import { Button1 } from "../componentindex";
import images from "../../img";

// smart contract import
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const HeroSection = () => {
  const { titleData } = useContext(NFTMarketplaceContext);
  return (
    <div className={Style.heroSection}>
      <div className={Style.heroSection_box}>
        <div className={Style.heroSection_box_left}>
          <h1> {titleData} </h1>
          <p>
            Discover the most outstanding NTFs in Sabancı University. Create
            your profile, upload NTFs and sell them.
          </p>
          <Button1 btnName="Start searching" />
        </div>
        <div className={Style.heroSection_box_right}>
          <Image
            src={images.hero}
            alt="Hero section"
            width={750}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;