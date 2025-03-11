import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.action";
import ProductCarousel from "@/components/shared/product/product-carsoul";
import ViewAllProductsButton from "@/components/view-all-products";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

const Home = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title="Newst Arrivals" limit={4} />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default Home;
