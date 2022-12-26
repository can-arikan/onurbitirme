import "../styles/globals.css";

// internal import
import { NavBar, Footer } from "../components/componentindex";
import {NFTMarketplaceProvider} from "../Context/NFTMarketplaceContext";

const MyApp = ({ Component, pageProps }) => (
  <div>
    <NFTMarketplaceProvider>
    <NavBar />
    <Component {...pageProps} />
    <Footer />
    </NFTMarketplaceProvider>
  </div>
);

export default MyApp;


