import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/router";
import { css, Dropdown } from 'react-bootstrap';
//import { DiJqueryLogo } from "react-icons/di";

// import react icons
import { MdNotifications } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import { CgMenuLeft, CgMenuRight } from 'react-icons/cg';

// internal import
import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Notification, Profile, SideBar} from './index';
import { Button1 } from '../componentindex';
import { Button } from 'react-bootstrap';
import images from '../../img';

// import from smart contract
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NavBar = () => {
  const [discover, setDiscover] = useState(false);   // taking states for all components
  const [profileDrop, setprofileDrop] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { checkWhitelist } = useContext(NFTMarketplaceContext);

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

  const router = useRouter();
  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if (btnText == "Discover") {
      setDiscover(true);
      setprofileDrop(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    }
    else if (btnText == "Create Account") {
      setDiscover(false);
      setprofileDrop(false);
      setHelp(true);
      setNotification(false);
      setProfile(false);
    }
    else {
      setDiscover(false);
      setprofileDrop(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    }
  }

  const openNotification = () => {
    if (!notification) {
      setNotification(true);
      setDiscover(false);
      setprofileDrop(false);
      setHelp(false);
      setProfile(false);
    }
    else {
      setNotification(false);
    }
  }

  const openProfile = () => {
    if (!profile) {
      setProfile(true);
      setHelp(false);
      setDiscover(false);
      setprofileDrop(false);
      setNotification(false);
    }
    else {
      setProfile(false);
    }
  }

  const openSideBar = () => {
    if (!openSideMenu) {
      setOpenSideMenu(true);
    }
    else {
      setOpenSideMenu(false);
    }
  }

  // smart contract part
  const { currentAccount, connectWallet, disconnectWallet
   } = useContext(
    NFTMarketplaceContext
  );
  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <div className={Style.logo} onClick={() => router.push("/")}>
              <Image
                src={images.logo}
                alt="SU NFT"
                width={120}
                height={120}
              />
            </div>
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type='text' placeholder='Search NFT' />
              <BsSearch onClick={() => { }} className={Style.search_icon} />
            </div>
          </div>
        </div>
        {/*end of left section */}
        <div className={Style.navbar_container_right}>

          {/* DISCOVER MENU */}
          <div className={Style.navbar_container_right_discover}>
            <p onClick={(e) => openMenu(e)}>Discover</p>
            {/*discover state is initially false*/}
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          {/* HELP CENTER MENU */}
          <div className={Style.navbar_container_right_help}>
            <p onClick={(e) => openMenu(e)}>Create Account</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>

          {/* NOTIFICATION */}
          <div className={Style.navbar_container_right_notify}>
            <MdNotifications className={Style.notify} onClick={() => openNotification()} />
            {notification && <Notification />}
          </div>

        

          
          {/* CONNECT BUTTON SECTION */}

          <div className={Style.navbar_container_right_button}>
            {currentAccount == null ? (
              <Button1 btnName="Connect" handleClick={() => connectWallet()} />
            ) : (
              <Button1
                btnName={currentAccount.slice(0, 5) + '...' + currentAccount.slice(38, 42)}
                handleClick={
                  () => {
                    openProfile();
                  }
                }
              />

            )}
            {profile && <Profile currentAccount={currentAccount} checkWhitelist={checkWhitelist} />}
          </div>

          <div className={Style.navbar_container_right_button}>
            {currentAccount != "" ? (
              <Button1 btnName="Disconnect" handleClick={() => disconnectWallet()} />
            ) : (
              <div
              div/>

            )}
          </div>

          {/* MENU BUTTON, will only display on mobile app */}
          <div className={Style.navbar_container_right_menuBtn}>
            <CgMenuRight className={Style.menuIcon}
              onClick={() => openSideBar()}
            />
          </div>
        </div>
      </div>

      {/* SIDEBAR COMPONENT, only in mobile, to see make it !*/}
      {openSideMenu && (
        <div className={Style.SideBar}>
          <SideBar setOpenSideMenu={setOpenSideMenu}
            currentAccount={currentAccount}
            connectWallet={connectWallet} />
        </div>
      )
      }
    </div>
  );
};

export default NavBar;