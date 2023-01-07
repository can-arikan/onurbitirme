import React,  { useState, useEffect} from "react";
import Image from "next/image";
import { FaUserAlt, FaRegImage, FaUserEdit } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import { TbDownloadOff, TbDownload } from "react-icons/tb";
import Link from "next/link";

// internal import
import Style from "./Profile.module.css";
import images from "../../../img";

const Profile = ({ currentAccount,checkWhitelist}) => {
  const [whitelistCheckResult, setWhitelistCheckResult] = useState(null);

  async function fetchWhitelistCheckResult() {
    // Call the contract function to get the whitelist check result
    //const result = await marketplace.isWhitelisted(account);
    const isWhitelisted = await checkWhitelist();
    console.log("BU WL WALLET DEGIL" + isWhitelisted);
    setWhitelistCheckResult(isWhitelisted);
    /*checkWhitelist().then((isWhitelisted) => {
      console.log(isWhitelisted);
      setWhitelistCheckResult(isWhitelisted);
    });*/
    // Update the state variable with the result
    //setWhitelistCheckResult(result);
  }
  useEffect(() => {
    fetchWhitelistCheckResult();
  }, []);
  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image
          src={images.default_user}
          alt="user profile"
          width={50}
          height={50}
          className={Style.profile_account_img}
        />

        {/* for now, we manually provide an address */}
        <div className={Style.profile_account_info}>
          <p></p>
          <medium>{currentAccount ? currentAccount.slice(0, 18) : null}..</medium>
          <p></p>
          <medium>{whitelistCheckResult? "Whitelisted User":" Not Whitelisted User"}</medium>
        </div>
      </div>

      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <div className={Style.profile_menu_one_item}>
            <FaUserAlt />
            <p>
              <Link href={{ pathname: "/author" }}>My Profile</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaRegImage />
            <p>
              <Link href={{ pathname: "/author" }}>My Items</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaUserEdit />
            <p>
              <Link href={{ pathname: "/account" }}>Edit Profile</Link>
            </p>
          </div>
        </div>

        <div className={Style.profile_menu_two}>
          {/* we apply same styling */}
          <div className={Style.profile_menu_one_item}>
            <MdHelpCenter />
            <p>
              <Link href={{ pathname: "/help" }}>Help</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;