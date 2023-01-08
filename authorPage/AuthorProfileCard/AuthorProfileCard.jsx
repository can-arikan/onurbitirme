import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  MdVerified,
  MdCloudUpload,
  MdOutlineReportProblem,
} from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";

// internal import
import Style from "./AuthorProfileCard.module.css";
import images from "../../img";
import { Button1 } from "../../components/componentindex.js";

const AuthorProfileCard = ({ currentAccount, connectWallet, checkWhitelist, checkOwner }) => {
  const [share, setShare] = useState(false);
  const [report, setReport] = useState(false);

  //copyAddress function
  const copyAddress = () => {
    const copyText = document.getElementById("myInput");

    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  };

  const openShare = () => {
    if (!share) {
      setShare(true);
      setReport(false);
    } else {
      setShare(false);
    }
  };

  const openReport = () => {
    if (!report) {
      setReport(true);
      setShare(false);
    } else {
      setReport(false);
    }
  };
  const router = useRouter();
  const [whitelistCheckResult, setWhitelistCheckResult] = useState(null);
  const [ownerCheckResult, setOwnerCheckResultCheckResult] = useState(null);

  async function fetchWhitelistCheckResult() {
    // Call the contract function to get the whitelist check result
    //const result = await marketplace.isWhitelisted(account);
    const isWhitelisted = await checkWhitelist();
    console.log("BU WL WALLET DEGIL" + isWhitelisted);
    setWhitelistCheckResult(isWhitelisted);
  }
  async function fetchOwnerCheckResult() {
    // Call the contract function to get the whitelist check result
    //const result = await marketplace.isWhitelisted(account);
    const isOwner = await checkOwner();
    console.log("BU OWNER WALLET DEGIL" + isOwner);
    setOwnerCheckResultCheckResult(isOwner);
  }
  useEffect(() => {
    fetchWhitelistCheckResult();
    fetchOwnerCheckResult();
  }, []);

  return (
    <div className={Style.AuthorProfileCard}>
      <div className={Style.AuthorProfileCard_box}>
        <div className={Style.AuthorProfileCard_box_img}>
          <Image
            src={images.nft_image_1}
            className={Style.AuthorProfileCard_box_img_img}
            alt="NFT IMAGES"
            width={220}
            height={220}
          />
        </div>

        <div className={Style.AuthorProfileCard_box_info}>
          <h2>
            Tunç Kaya {""}{" "}
            <span>
              <MdVerified />
            </span>{" "}
          </h2>

          <div className={Style.AuthorProfileCard_box_info_address}>
            <input
              type="text"
              value={currentAccount}
              id="myInput"
            />
            <FiCopy
              onClick={() => copyAddress()}
              className={Style.AuthorProfileCard_box_info_address_icon}
            />
          </div>

          <p>
            SuPunk #4786
            Contributing to @su_cards, an NFT Monetization Platform.
          </p>

          <div className={Style.AuthorProfileCard_box_info_social}>
            <a href="#">
              <TiSocialFacebook />
            </a>
            <a href="#">
              <TiSocialInstagram />
            </a>
            <a href="#">
              <TiSocialLinkedin />
            </a>
            <a href="#">
              <TiSocialYoutube />
            </a>
          </div>
        </div>

        <div className={Style.AuthorProfileCard_box_share}>
          <div className={Style.navbar_container_right_button}>
            {currentAccount == "" ? (
              <Button1 btnName="Connect" handleClick={() => connectWallet()} />
            ) : (
              <Button1
                btnName="Mint NFT"
                handleClick={
                  () => {
                    if (whitelistCheckResult) {
                      router.push("/uploadNFT");
                      console.log("whitelistCheckResult");

                    } else {
                      alert("Error: You are not whitelisted.");
                    }
                  }
                }
              />

            )}
          </div>
          <Button1 btnName="Follow" handleClick={() => { }} />
          <MdCloudUpload
            onClick={() => openShare()}
            className={Style.AuthorProfileCard_box_share_icon}
          />

          {share && (
            <div className={Style.AuthorProfileCard_box_share_upload}>
              <p>
                <span>
                  <TiSocialFacebook />
                </span>{" "}
                {""}
                Facebook
              </p>
              <p>
                <span>
                  <TiSocialInstagram />
                </span>{" "}
                {""}
                Instragram
              </p>
              <p>
                <span>
                  <TiSocialLinkedin />
                </span>{" "}
                {""}
                LinkedIn
              </p>
              <p>
                <span>
                  <TiSocialYoutube />
                </span>{" "}
                {""}
                YouTube
              </p>
            </div>
          )}

          <BsThreeDots
            onClick={() => openReport()}
            className={Style.AuthorProfileCard_box_share_icon}
          />

          {report && (
            <p className={Style.AuthorProfileCard_box_share_report}>
              <span>
                <MdOutlineReportProblem />
              </span>{" "}
              {""}
              Report abuse
            </p>
          )}
        </div>
        <div className={Style.navbar_container_right_button}>
          {ownerCheckResult ? (
            <Button1
              btnName="Add Whitelist Wallet"
              handleClick={
                () => {
                    router.push("/addwhitelist");
                    console.log("ownerCheckResult");  
                }
              }
            />
          ) : (
            <div div/>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfileCard;