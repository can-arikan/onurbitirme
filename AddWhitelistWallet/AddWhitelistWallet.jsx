import React, { useState } from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import Style from "./Upload.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import images from "../img";
import { Button1 } from "../components/componentindex.js";
import { DropZone } from "../UploadNFT/uploadNFTIndex.js";

const AddWhitelistWallet = ({addToWhitelist}) => {
  const [name, setUserame] = useState("");
  const [wallet, setWallet] = useState("");

  const router = useRouter();

  return (
    <div className={Style.upload}>
      <div className={Style.upload_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="nft"> Username</label>
          <input
            type="text"
            placeholder="Please enter your SU Username"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setUserame(e.target.value)}
          />
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="wallet"> Wallet Address</label>
          <input
            type="text"
            placeholder="Please enter your Ethereum Wallet Address"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setWallet(e.target.value)}
          />
        </div>
        <div className={Style.upload_box_btn}>
          <Button1
            btnName="Add to Whitelist"
            handleClick={async () =>
              addToWhitelist(
                name,
                wallet
              )
            }
            classStyle={Style.upload_box_btn_style}
          />
        </div>
      </div>
    </div>
  );
};

export default AddWhitelistWallet;