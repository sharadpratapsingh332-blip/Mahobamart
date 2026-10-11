import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Category";
import OfferBanner from "../components/OfferBanner";
import RestaurantSection from "../components/RestaurantSection";
import GrocerySection from "../components/GrocerySection";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <OfferBanner />

      <RestaurantSection />

      <GrocerySection />

      <Features />

      <Footer />
    </>
  );
};

export default Home;