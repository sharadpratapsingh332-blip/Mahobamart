
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

import { Store, ArrowLeft, Package } from "lucide-react";
import Navbar from "../components/Navbar";

const CategoryDetails = () => {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);

      try {
        const res = await api.get(
          `/categories/${id}/products`
        );

        setCategory(res.data.category);
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching category:", error);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  // Get unique shops from the products
  const uniqueShops = [
    ...new Map(
      products
        .filter((product) => product.shop?._id)
        .map((product) => [product.shop._id, product.shop])
    ).values(),
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
            <p className="mt-3 text-sm text-gray-500">
              Loading category...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Navbar />
        <div className="px-4 py-16 text-center sm:py-20">
          <Package size={44} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Category not found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please go back and select another category.
          </p>
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-50 sm:mb-7 sm:px-4"
          >
            <ArrowLeft size={17} />
            Go to Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-gray-50 pb-8 sm:pb-12">
        <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

          {/* Category Heading */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-50 sm:mb-7 sm:px-4"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>

            <h1 className="break-words text-2xl font-bold text-slate-800 sm:text-3xl lg:text-4xl">
              {category.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">
              Discover products available in this category.
            </p>
          </div>

          {/* Products Section */}
          <section>
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Products
              </h2>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:text-sm">
                {products.length} items
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-xl bg-white p-2.5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:rounded-2xl sm:p-4"
                  >
                    {/* Product Image */}
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 sm:rounded-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-1 flex-col pt-3">
                      <h3 className="line-clamp-2 min-h-10 break-words text-sm font-bold leading-5 text-slate-800 sm:min-h-12 sm:text-base sm:leading-6 lg:text-lg">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-base font-bold text-green-600 sm:text-lg">
                        ₹{product.price}
                      </p>

                      <div className="mt-2 flex min-w-0 items-center gap-1.5 text-gray-500 sm:gap-2">
                        <Store
                          size={16}
                          className="shrink-0 text-gray-400"
                        />
                        <span className="truncate text-xs sm:text-sm">
                          {product.shop?.name || "Local Store"}
                        </span>
                      </div>

                      <div className="mt-3 border-t border-gray-100 pt-2.5">
                        <span className="text-xs font-semibold text-green-700 sm:text-sm">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white px-4 py-10 text-center shadow-sm sm:rounded-2xl sm:py-14">
                <Package
                  size={40}
                  className="mx-auto text-gray-300"
                />
                <h3 className="mt-3 font-semibold text-gray-700">
                  No products available
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Products in this category will appear here when available.
                </p>
              </div>
            )}
          </section>

          {/* Shops Section */}
          <section className="mt-10 sm:mt-14 lg:mt-16">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
                Shops
              </h2>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Explore stores selling these products.
              </p>
            </div>

            {uniqueShops.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {uniqueShops.map((shop) => (
                  <Link
                    key={shop._id}
                    to={`/shop/${shop._id}`}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:rounded-2xl"
                  >
                    {/* Shop Image */}
                    <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      <img
                        src={shop.image}
                        alt={shop.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Shop Details */}
                    <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                          <Store size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-base font-bold text-slate-800 sm:text-lg">
                            {shop.name}
                          </h3>

                          <p className="mt-1 line-clamp-2 break-words text-sm text-gray-500">
                            {shop.address || "Address not available"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-gray-100 pt-3">
                        <span className="text-sm font-semibold text-green-600">
                          Explore Store →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-5 text-center sm:rounded-2xl sm:p-8">
                <p className="text-sm text-gray-500">
                  No shops found for the available products in this category.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default CategoryDetails;

