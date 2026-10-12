
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import {
  Store,
  MapPin,
  Package,
  IndianRupee,
  ShoppingBag,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lng");

  useEffect(() => {
    if (latitude && longitude) {
      getNearbyProducts();
    } else {
      setProducts([]);
      setShops([]);
      setLoading(false);
    }
  }, [latitude, longitude]);

  const getNearbyProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/products/nearby?latitude=${latitude}&longitude=${longitude}`
      );

      setProducts(res.data.products || []);
      setShops(res.data.shops || []);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Unable to load nearby shops and products."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <LoaderCircle
            size={40}
            className="animate-spin text-green-600"
          />
          <p className="mt-4 text-base font-medium text-gray-600 sm:text-lg">
            Finding nearby shops and products...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Back to Home */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-100 sm:mb-8 sm:text-base"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          {/* Page Heading */}
          <div className="mb-7 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white shadow-sm sm:mb-10 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <MapPin size={30} className="shrink-0 sm:h-9 sm:w-9" />

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                  Discover Nearby
                </h1>
                <p className="mt-1 text-sm text-green-50 sm:text-base">
                  Explore local shops and products near you.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
              <p className="break-words text-red-600">{error}</p>

              <button
                onClick={getNearbyProducts}
                className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Nearby Shops */}
              <section className="mb-9 sm:mb-12">
                <div className="mb-5 flex items-center gap-3 sm:mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:h-12 sm:w-12">
                    <Store size={24} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                      Nearby Shops
                    </h2>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      {shops.length}{" "}
                      {shops.length === 1 ? "shop" : "shops"} found
                    </p>
                  </div>
                </div>

                {shops.length === 0 ? (
                  <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
                    <Store
                      size={36}
                      className="mx-auto text-gray-300"
                    />
                    <p className="mt-3 text-sm text-gray-500 sm:text-base">
                      No nearby shops found for this location.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    {shops.map((shop) => (
                      <Link
                        key={shop._id}
                        to={`/shop/${shop._id}`}
                        className="group min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <img
                          src={shop.image}
                          alt={shop.name}
                          loading="lazy"
                          className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-48"
                        />

                        <div className="p-4 sm:p-5">
                          <h3 className="break-words text-lg font-bold text-gray-900 transition group-hover:text-green-700 sm:text-xl">
                            {shop.name}
                          </h3>

                          <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-gray-500">
                            <MapPin
                              size={17}
                              className="mt-1 shrink-0 text-green-600"
                            />
                            <span className="break-words">
                              {shop.address || "Address unavailable"}
                            </span>
                          </p>

                          <p className="mt-4 text-sm font-semibold text-green-700">
                            Explore Shop →
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Nearby Products */}
              <section>
                <div className="mb-5 flex items-center gap-3 sm:mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:h-12 sm:w-12">
                    <Package size={24} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                      Nearby Products
                    </h2>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      {products.length}{" "}
                      {products.length === 1 ? "product" : "products"} found
                    </p>
                  </div>
                </div>

                {products.length === 0 ? (
                  <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
                    <ShoppingBag
                      size={36}
                      className="mx-auto text-gray-300"
                    />
                    <p className="mt-3 text-sm text-gray-500 sm:text-base">
                      No products found near your location.
                    </p>
                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                      Try another location or check back later.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <Link
                        to={`/product/${product._id}`}
                        key={product._id}
                        className="group flex min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:shadow-lg sm:rounded-2xl"
                      >
                        <div className="overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-32 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-48 lg:h-52"
                          />
                        </div>

                        <div className="flex flex-1 flex-col p-3 sm:p-4">
                          <h3 className="line-clamp-2 break-words text-sm font-bold text-gray-900 group-hover:text-green-700 sm:text-lg">
                            {product.name}
                          </h3>

                          <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm">
                            {product.description || "No description available."}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-1">
                            <p className="flex items-center text-base font-bold text-green-600 sm:text-xl">
                              <IndianRupee size={15} />
                              {product.price}
                            </p>

                            <span className="text-[10px] text-gray-500 sm:text-xs">
                              Stock: {product.stock}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-1 break-words text-xs text-blue-600 sm:text-sm">
                            Shop: {product.shop?.name || "Local Shop"}
                          </p>

                          <span className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-2 py-2.5 text-xs font-semibold text-white transition group-hover:bg-green-700 sm:mt-4 sm:py-3 sm:text-sm">
                            <ShoppingBag size={15} />
                            View Product
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

        </div>
      </main>
    </>
  );
};

export default Products;

