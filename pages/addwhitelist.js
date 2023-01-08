import React, { useEffect, useState, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/upload-nft.module.css";
import { AddWhitelistWallet } from "../AddWhitelistWallet/addWhitelistWalletIndex";


//SMART CONTRACT IMPORT
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const addwhitelist = () => {

    const { addToWhitelist} = useContext(NFTMarketplaceContext);
  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>Add New Whitelist User</h1>
          <p>
            You can set username and ethereum wallet address in here.
          </p>
        </div>
        <div className={Style.uploadNFT_box_form}>
          <AddWhitelistWallet addToWhitelist={addToWhitelist}/>
        </div>
      </div>
    </div>
  );
};

export default addwhitelist;