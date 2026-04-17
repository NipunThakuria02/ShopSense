import { Helmet } from 'react-helmet-async';
import WishlistPanel from '../components/WishlistPanel';

function Wishlist() {
  return (
    <>
      <Helmet>
        <title>My Wishlist — ShopSense AI</title>
        <meta name="description" content="Your saved products with price alerts and target price tracking." />
        <link rel="canonical" href="https://shopsense-ai.web.app/wishlist" />
      </Helmet>
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <WishlistPanel />
      </main>
    </>
  );
}

export default Wishlist;
