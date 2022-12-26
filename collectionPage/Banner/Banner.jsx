import React from "react";
import Image from "next/image";

// internal import
import Style from "./Banner.module.css";

// one div will only display on mobile, the other is for web
const Banner = ({ bannerImage }) => {
  return (
    <div className={Style.banner}>
      <div className={Style.banner_img}>
        <Image
          src={bannerImage}
          objectFit="cover"
          alt="background"
          width={1600}
          height={300}
        />
      </div>

      <div className={Style.banner_img_mobile}>
        <Image
          src={bannerImage}
          objectFit="cover"
          alt="background"
          width={1600}
          height={900}
        />
      </div>
    </div>
  );
};

export default Banner;