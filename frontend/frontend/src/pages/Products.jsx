
import React, { useEffect, useState } from "react";
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
  ArrowLeft
} from "lucide-react";

// Calculate distance using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371;

  const toRadians = (degree) => {
    return degree * (Math.PI / 180);
  };

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const Products = () => {
  const [searchParams] = useSearchParams();

  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lng");

  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate distance for an individual product's shop
  const getProductDistance = (product) => {
    if (
      latitude === null ||
      longitude === null ||
      !product.shop?.location?.coordinates
    ) {
      return null;
    }

    const [shopLongitude, shopLatitude] =
      product.shop.location.coordinates;

    const customerLat = Number(latitude);
    const customerLng = Number(longitude);

    if (
      !Number.isFinite(customerLat) ||
      !Number.isFinite(customerLng) ||
      !Number.isFinite(shopLatitude) ||
      !Number.isFinite(shopLongitude)
    ) {
      return null;
    }

    const distance = calculateDistance(
      customerLat,
      customerLng,
      shopLatitude,
      shopLongitude
    );

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m away`;
    }

    return `${distance.toFixed(1)} km away`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        if (!latitude || !longitude) {
          setError("Please select your location to see nearby products.");
          setProducts([]);
          setShops([]);
          return;
        }

        const res = await api.get(
          `/products/nearby?latitude=${latitude}&longitude=${longitude}`
        );

        setProducts(res.data.products || []);
        setShops(res.data.shops || []);

      } catch (error) {
        console.error("Fetch products error:", error);

        setError(
          error.response?.data?.message ||
          "Unable to load nearby products. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [latitude, longitude]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="mx-auto mb-6 max-w-7xl">

          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Nearby Products
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Discover products available from shops near your location.
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Store size={17} className="text-green-600" />
              {shops.length} Nearby Shops
            </div>

            <div className="flex items-center gap-2">
              <ShoppingBag size={17} className="text-green-600" />
              {products.length} Products Available
            </div>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">

              <LoaderCircle
                size={40}
                className="mx-auto animate-spin text-green-600"
              />

              <p className="mt-3 text-gray-600">
                Finding nearby products...
              </p>

            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-7xl rounded-xl border border-red-200 bg-red-50 p-5 text-center">

            <MapPin
              size={30}
              className="mx-auto text-red-500"
            />

            <p className="mt-2 font-medium text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* No products */}
        {!loading && !error && products.length === 0 && (
          <div className="mx-auto max-w-7xl rounded-xl border border-gray-200 bg-white p-10 text-center">

            <Package
              size={45}
              className="mx-auto text-gray-400"
            />

            <h2 className="mt-3 text-xl font-semibold text-gray-800">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500">
              No products are available from shops within 7 km of your location.
            </p>

          </div>
        )}

        {/* Product Cards */}
        {!loading && !error && products.length > 0 && (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => {
              const distance = getProductDistance(product);

              return (
                <div
                  key={product._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package
                          size={45}
                          className="text-gray-400"
                        />
                      </div>
                    )}

                    <span className="absolute right-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                      Nearby
                    </span>

                  </div>

                  {/* Product Details */}
                  <div className="p-4">

                    <h2 className="text-lg font-bold text-gray-800">
                      {product.name}
                    </h2>

                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gray-500">
                      {product.description}
                    </p>

                    {/* Shop Name */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <Store
                        size={16}
                        className="shrink-0 text-green-600"
                      />

                      <span className="truncate">
                        {product.shop?.name || "Shop"}
                      </span>
                    </div>

                    {/* Shop Distance */}
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-green-700">

                      <MapPin
                        size={16}
                        className="shrink-0"
                      />

                      <span>
                        {distance || "Distance unavailable"}
                      </span>

                    </div>

                    {/* Address */}
                    {product.shop?.address && (
                      <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">

                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0"
                        />

                        <span className="line-clamp-1">
                          {product.shop.address}
                        </span>

                      </div>
                    )}

                    {/* Price and Stock */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">

                      <div className="flex items-center gap-1 text-lg font-bold text-green-700">
                        <IndianRupee size={17} />
                        {product.price}
                      </div>

                      <span className={`text-xs font-medium ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}>
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>

                    </div>

                    {/* View Product Button */}
                    <Link
                      to={`/product/${product._id}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <ShoppingBag size={17} />
                      View Product
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </>
  );
};

export default Products;
