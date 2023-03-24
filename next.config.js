/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["main-sunft.infura-ipfs.io", "infura-ipfs.io", "sabanci-nft-marketplace.infura-ipfs.io"],
  },
}
// https://main-sunft.infura-ipfs.io
module.exports = nextConfig
