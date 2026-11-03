
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import {
  ArrowLeft,
  Store,
  Tag,
  Package,
  IndianRupee,
  Minus,
  Plus,
  ShoppingBag,
  LoaderCircle,
  MapPin,
} from "lucide-react";

// ==========================================
// 1. Calculate distance using Haversine formula
// ==========================================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const toRadians = (degree) => degree * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// ==========================================
// 2. Calculate delivery charge
// ==========================================

const calculateDeliveryCharge = (distance) => {
  if (distance === null || !Number.isFinite(distance) || distance < 0) {
    return null;
  }

  if (distance <= 2) {
    return 15;
  }

  if (distance <= 5) {
    return 40;
  }

  if (distance <= 10) {
    return 60;
  }

  return null;
};

// ==========================================
// 3. Product Details Component
// ==========================================

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Customer location
  const [customerLocation, setCustomerLocation] = useState(null);

  // ==========================================
  // 4. Fetch product, profile and customer location
  // ==========================================

  useEffect(() => {
    fetchProduct();
    fetchProfile();
    getCustomerLocation();
  }, [id]);

  // Get customer's current location
  const getCustomerLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // ==========================================
  // 5. Get actual distance between customer and shop
  // ==========================================

  const getShopDistanceKm = () => {
    const coordinates = product?.shop?.location?.coordinates;

    if (
      !customerLocation ||
      !coordinates ||
      coordinates.length < 2
    ) {
      return null;
    }

    // MongoDB coordinates: [longitude, latitude]
    const [shopLongitude, shopLatitude] = coordinates;

    const latitude = Number(shopLatitude);
    const longitude = Number(shopLongitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return calculateDistance(
      customerLocation.latitude,
      customerLocation.longitude,
      latitude,
      longitude
    );
  };

  // ==========================================
  // 6. Fetch customer profile
  // ==========================================

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch (error) {
      console.log("Profile loading failed:", error);
    }
  };

  // ==========================================
  // 7. Fetch product details
  // ==========================================

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      setProduct(null);
      setQuantity(1);

      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Unable to load this product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 8. Handle Order Now
  // ==========================================

  const handleOrderNow = () => {
    if (!product) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (deliveryCharge === null) {
      return;
    }

    navigate("/checkout", {
      state: {
        product,
        quantity,
        deliveryCharge,
        distance: shopDistanceKm,
        totalAmount,
      },
    });
  };

  // ==========================================
  // 9. Loading screen
  // ==========================================

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
            Loading product...
          </p>
        </div>
      </>
    );
  }

  // ==========================================
  // 10. Error screen
  // ==========================================

  if (error || !product) {
    return (
      <>
        <Navbar />

        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <Package size={48} className="text-gray-400" />

          <h2 className="mt-4 text-xl font-bold text-gray-800 sm:text-2xl">
            Product Not Available
          </h2>

          <p className="mt-2 break-words text-sm text-gray-500 sm:text-base">
            {error || "This product could not be found."}
          </p>

          <button
            onClick={fetchProduct}
            className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="mt-3 text-sm font-medium text-green-700 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </>
    );
  }

  // ==========================================
  // 11. Calculate product and delivery amounts
  // ==========================================

  const stock = Number(product.stock) || 0;
  const outOfStock = stock < 1;

  // Actual distance in kilometers
  const shopDistanceKm = getShopDistanceKm();

  // Formatted distance for display
  const shopDistance =
    shopDistanceKm === null
      ? null
      : shopDistanceKm < 1
        ? `${Math.round(shopDistanceKm * 1000)} m away`
        : `${shopDistanceKm.toFixed(1)} km away`;

  // Calculate delivery charge
  const deliveryCharge = calculateDeliveryCharge(shopDistanceKm);

  // Calculate product subtotal
  const productTotal = Number(product.price) * quantity;

  // Calculate final amount
  const totalAmount =
    deliveryCharge === null
      ? null
      : productTotal + deliveryCharge;

  // Check whether delivery is unavailable
  const deliveryUnavailable = deliveryCharge === null;

  // ==========================================
  // 12. Main Product Details UI
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-100 active:scale-[0.98] sm:mb-7 sm:text-base"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Product Layout */}
          <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-7 md:grid-cols-2 md:gap-8 lg:gap-10">

            {/* Product Image */}
            <div className="h-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="h-full min-h-[280px] w-full object-cover sm:min-h-[350px] md:min-h-[600px]"
              />
            </div>

            {/* Product Information */}
            <section className="flex h-full min-w-0 flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6 lg:p-8">

              {/* Category and Stock */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 sm:text-sm">
                  <Tag size={14} />
                  {product.category?.name || "Product"}
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                    outOfStock
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {outOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="mt-4 break-words text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              {/* Description */}
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                {product.description || "No description available."}
              </p>

              {/* Product Price */}
              <div className="mt-5 border-b border-gray-100 pb-5 sm:mt-6 sm:pb-6">
                <p className="text-sm text-gray-500">
                  Price per item
                </p>

                <p className="mt-1 flex items-center text-3xl font-bold text-green-600 sm:text-4xl">
                  <IndianRupee size={27} />
                  {product.price}
                </p>
              </div>

              {/* Shop, Distance, Stock and Address */}
              <div className="mt-5 space-y-4 sm:mt-6">

                {/* Shop Name */}
                <div className="flex items-start gap-3">
                  <Store
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Available at
                    </p>

                    <p className="break-words font-semibold text-gray-800">
                      {product.shop?.name || "Shop unavailable"}
                    </p>
                  </div>
                </div>

                {/* Shop Distance */}
                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Distance from you
                    </p>

                    <p className="font-semibold text-green-700">
                      {shopDistance || "Distance unavailable"}
                    </p>
                  </div>
                </div>

                {/* Available Stock */}
                <div className="flex items-start gap-3">
                  <Package
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Available Stock
                    </p>

                    <p className="font-semibold text-gray-800">
                      {stock} items
                    </p>
                  </div>
                </div>

                {/* Shop Address */}
                {product.shop?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={20}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 sm:text-sm">
                        Shop Address
                      </p>

                      <p className="break-words text-sm text-gray-700 sm:text-base">
                        {product.shop.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 sm:mt-8">
                <h3 className="mb-3 text-sm font-semibold text-gray-800 sm:text-base">
                  Select Quantity
                </h3>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1 || outOfStock}
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="min-w-8 text-center text-xl font-bold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={outOfStock || quantity >= stock}
                    onClick={() =>
                      setQuantity((prev) => Math.min(stock, prev + 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={18} />
                  </button>

                  <span className="ml-1 text-xs text-gray-500 sm:text-sm">
                    {outOfStock ? "Unavailable" : `${stock} available`}
                  </span>
                </div>
              </div>

              {/* ==========================================
                  13. Delivery Charges and Total Amount
                  ========================================== */}

              <div className="mt-6 space-y-3 rounded-xl bg-green-50 p-4 sm:mt-8 sm:p-5">

                {/* Product Subtotal */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">
                    Product Total ({quantity} item{quantity > 1 ? "s" : ""})
                  </span>

                  <span className="flex items-center font-semibold text-gray-800">
                    <IndianRupee size={16} />
                    {productTotal.toFixed(2)}
                  </span>
                </div>

                {/* Delivery Distance */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">
                    Delivery Distance
                  </span>

                  <span className="text-sm font-semibold text-gray-800">
                    {shopDistance || "Unavailable"}
                  </span>
                </div>

                {/* Delivery Charge */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">
                    Delivery Charges
                  </span>

                  <span className="font-semibold text-gray-800">
                    {deliveryCharge === null ? (
                      "Unavailable"
                    ) : deliveryCharge === 0 ? (
                      <span className="text-green-700">FREE</span>
                    ) : (
                      <span className="flex items-center">
                        <IndianRupee size={16} />
                        {deliveryCharge}
                      </span>
                    )}
                  </span>
                </div>

                {/* Final Total */}
                <div className="border-t border-green-200 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-semibold text-gray-700">
                      Total Amount
                    </span>

                    <span className="flex items-center text-xl font-bold text-green-700 sm:text-2xl">
                      {totalAmount === null ? (
                        "Unavailable"
                      ) : (
                        <>
                          <IndianRupee size={20} />
                          {totalAmount.toFixed(2)}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Delivery Unavailable Message */}
                {deliveryUnavailable && (
                  <p className="text-sm text-red-600">
                    {shopDistanceKm === null
                      ? "Please enable your location and allow access to calculate delivery charges."
                      : "Sorry! Delivery is not available beyond 10 km."}
                  </p>
                )}
              </div>

              {/* Order Button */}
              <button
                onClick={handleOrderNow}
                disabled={outOfStock || deliveryUnavailable}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400 sm:py-4 sm:text-lg"
              >
                <ShoppingBag size={20} />

                {outOfStock
                  ? "Out of Stock"
                  : deliveryUnavailable
                    ? "Delivery Unavailable"
                    : "Order Now"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500 sm:text-sm">
                Local Delivery, Local Support
              </p>

            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
