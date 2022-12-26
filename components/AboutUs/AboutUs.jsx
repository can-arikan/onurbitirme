import React from "react";
import Image from "next/image";

// internal import
import Style from "./AboutUs.module.css";
import images from "../../img";

const AboutUs = () => {
  return (
    <div className={Style.aboutUs}>
      <div className={Style.aboutUs_box}>
        <div className={Style.aboutUs_box_left}>
          <Image
            src={images.aboutus}
            alt="About us section"
            width={700}
            height={500}
          />
        </div>
        <div className={Style.aboutUs_box_right}>
          <h1>About Us</h1>
          <p>
            We are a group of students and teachers who wanted to create an NFT Marketplace for Sabancı University.
            This marketplace includes the amazing digital arts of our students as well as our faculty members'.
          </p>
        </div>
      </div>
    </div>
  );
};


export default AboutUs;
