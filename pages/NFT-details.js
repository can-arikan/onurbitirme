import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

// internal imports
import { Button1, Category} from "../components/componentindex";
import NFTDetailsPage from "../NFTDetailsPage/NFTDetailsPage";

// smart contract import
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const NFTDetails = () => {
  const {currentAccount} = useContext(NFTMarketplaceContext);

  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    price: "",
    seller: "",
  });

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    setNft(router.query);
  }, [router.isReady]);
  return (
    <div>
      <NFTDetailsPage nft={nft} />
      <Category />
    </div>
  );
};

export default NFTDetails;
