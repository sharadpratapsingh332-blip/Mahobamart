
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

import {
  ArrowLeft,
  MapPin,
  Phone,
  ShoppingBag,
  LocateFixed,
  LoaderCircle,
  MapPinned,
} from "lucide-react";

import Navbar from "../components/Navbar";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity } = location.state || {};

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // Get the best available location from multiple readings.
  const getBestCurrentLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("Geolocation is not supported by your browser.")
        );
        return;
      }

      let bestPosition = null;
      let attempts = 0;
      let finished = false;
      let watchId;

      const finish = (position) => {
        if (finished) return;
        finished = true;

        if (watchId !== undefined) {
          navigator.geolocation.clearWatch(watchId);
        }

        resolve(position);
      };

      const fail = (error) => {
        if (finished) return;
        finished = true;

        if (watchId !== undefined) {
          navigator.geolocation.clearWatch(watchId);
        }

        if (bestPosition) {
          resolve(bestPosition);
        } else {
          reject(error);
        }
      };

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          attempts++;

          if (
            !bestPosition ||
            position.coords.accuracy < bestPosition.coords.accuracy
          ) {
            bestPosition = position;
          }

          // Stop early when the reported accuracy is 20 metres or better.
          if (position.coords.accuracy <= 20) {
            finish(position);
            return;
          }

          // Otherwise, collect up to five readings.
          if (attempts >= 5) {
            finish(bestPosition);
          }
        },
        fail,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 45000,
        }
      );

      // Safety fallback in case no position arrives.
      setTimeout(() => {
        if (finished) return;

        if (bestPosition) {
          finish(bestPosition);
        } else {
          fail(new Error("Location request timed out. Please try again."));
        }
      }, 46000);
    });

  // Find the address using the selected coordinates.
  const getAddressFromCoordinates = async (latitude, longitude) => {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(latitude),
      lon: String(longitude),
      zoom: "18",
      addressdetails: "1",
      "accept-language": "en",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Could not retrieve the address. Please try again or enter it manually."
      );
    }

    const data = await response.json();

    if (!data.address || !data.display_name) {
      throw new Error(
        "No mapped address was found. Please enter your address manually."
      );
    }

    const a = data.address;

    const parts = [
      a.house_number,
      a.building,
      a.road,
      a.neighbourhood || a.suburb,
      a.city || a.town || a.village || a.municipality,
      a.state_district,
      a.state,
      a.postcode,
    ].filter(Boolean);

    return [...new Set(parts)].join(", ") || data.display_name;
  };

  // Detect current location and fill the address field.
  const handleUseCurrentLocation = async () => {
    setLocating(true);
    setLocationAccuracy(null);

    try {
      const position = await getBestCurrentLocation();

      const { latitude, longitude, accuracy } = position.coords;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("Accuracy in meters:", accuracy);

      setCoordinates({ latitude, longitude });
      setLocationAccuracy(Math.round(accuracy));

      const detectedAddress = await getAddressFromCoordinates(
        latitude,
        longitude
      );

      setAddress(detectedAddress);
    } catch (error) {
      console.error("Location error:", error);

      if (error.code === 1) {
        alert("Please allow location permission in your browser settings.");
      } else if (error.code === 2) {
        alert("Your location is unavailable. Please enable GPS and try again.");
      } else if (error.code === 3) {
        alert("Location timed out. Please try again.");
      } else {
        alert(
          error.message ||
            "Could not detect your location. Please enter your address manually."
        );
      }
    } finally {
      setLocating(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Place the order.
  const handlePlaceOrder = async () => {
    if (!product?._id) {
      alert("Product details are missing. Please select the product again.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);

      await api.post(
        "/orders",
        {
          product: product._id,
          quantity,
          address: address.trim(),
          phone: phone.trim(),
        },
        { withCredentials: true }
      );

      alert("Order Placed Successfully");
      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);

      alert(
        error.response?.data?.message || "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            No product selected
          </h2>

          <p className="text-gray-500 mt-2">
            Please select a product before checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
          >
            Browse Products
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-5 sm:mb-6 px-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-gray-800 font-semibold px-5 py-2 -ml-2 rounded-lg mb-7"
            >
              <ArrowLeft size={21} />
              <span>Back</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Checkout
            </h1>

            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Confirm your order and delivery details
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Product image */}
            <div className="w-full h-52 sm:h-64 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product details */}
            <div className="mt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {product.name}
              </h2>

              <p className="text-green-600 text-xl font-bold mt-2">
                ₹{product.price}
              </p>

              <div className="flex justify-between items-center text-sm sm:text-base text-gray-600 mt-3">
                <span>Quantity</span>
                <span className="font-semibold text-gray-900">
                  {quantity}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 mt-4 pt-4">
                <span className="font-semibold text-gray-800">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-green-600">
                  ₹{product.price * quantity}
                </span>
              </div>
            </div>

            {/* Delivery details */}
            <div className="mt-7">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Details
              </h3>

              {/* Phone number */}
              <div className="mb-5">
                <label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Phone size={17} />
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full min-w-0 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none p-3 sm:p-3.5 rounded-xl mt-2 text-base"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>

              {/* Delivery address and location button */}
              <div>
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label
                    htmlFor="address"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <MapPin size={18} />
                    Delivery Address
                  </label>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-60"
                  >
                    {locating ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <LocateFixed size={18} />
                    )}

                    {locating
                      ? "Finding location..."
                      : "Use Current Location"}
                  </button>
                </div>

                <textarea
                  id="address"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full min-w-0 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none p-3 sm:p-3.5 rounded-xl text-base resize-y"
                  rows={3}
                  placeholder="House number, street, area, Mahoba..."
                />

                {locationAccuracy !== null && (
                  <div className="mt-3 rounded-xl bg-green-50 border border-green-100 p-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-green-800">
                      <MapPinned size={17} />
                      Location detected
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Estimated device accuracy: about{" "}
                      {locationAccuracy} metres.
                    </p>

                    {coordinates && (
                      <p className="text-xs text-gray-500 mt-1 break-all">
                        {coordinates.latitude}, {coordinates.longitude}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 mt-2">
                      Please verify your house number and street. You can
                      edit the address above if needed.
                    </p>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  Address lookup ©{" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    OpenStreetMap contributors
                  </a>
                </p>
              </div>
            </div>

            {/* Place order */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || locating}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3.5 rounded-xl mt-6 active:scale-[0.98] transition duration-150"
            >
              <ShoppingBag size={19} />

              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Please check your delivery details before placing your order.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Checkout;
