
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import {
  ArrowLeft,
  MapPin,
  Phone,
  LocateFixed,
  Loader2,
  ShoppingBag,
  Truck,
  CheckCircle,
} from "lucide-react";

// Format distance in a readable way
const formatDistance = (distance) => {
  if (distance === null || distance === undefined || !Number.isFinite(Number(distance))) {
    return "Not available";
  }

  const km = Number(distance);

  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }

  return `${km.toFixed(1)} km`;
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Receive product and delivery details from ProductDetails.jsx
  const {
    product,
    quantity,
    deliveryCharge,
    distance,
    totalAmount,
  } = location.state || {};

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // Calculate product subtotal
  const productTotal =
    Number(product?.price || 0) * Number(quantity || 1);

  // Use delivery information received from ProductDetails
  const finalDeliveryCharge =
    Number.isFinite(Number(deliveryCharge)) &&
    deliveryCharge !== null &&
    deliveryCharge !== undefined
      ? Number(deliveryCharge)
      : null;

  const finalTotal =
    finalDeliveryCharge !== null
      ? productTotal + finalDeliveryCharge
      : null;

  // Get the best available GPS location
  const getBestCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }

      let bestPosition = null;
      let readings = 0;
      let watchId = null;
      let finished = false;

      const finish = () => {
        if (finished) return;

        finished = true;

        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }

        if (bestPosition) {
          resolve(bestPosition);
        } else {
          reject(new Error("Unable to get your location. Please try again."));
        }
      };

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          readings++;

          if (
            !bestPosition ||
            position.coords.accuracy < bestPosition.coords.accuracy
          ) {
            bestPosition = position;
          }

          // Stop after collecting 5 readings
          if (readings >= 5) {
            finish();
          }
        },
        (error) => {
          if (!bestPosition) {
            finished = true;

            if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId);
            }

            reject(new Error(error.message || "Location permission denied."));
          } else {
            finish();
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 45000,
        }
      );

      // Stop waiting after 46 seconds
      setTimeout(() => {
        finish();
      }, 46000);
    });
  };

  // Convert latitude and longitude into a readable address
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      if (!response.ok) {
        throw new Error("Unable to detect address.");
      }

      const data = await response.json();

      return data.display_name || "";
    } catch (error) {
      console.error("Address detection error:", error);
      return "";
    }
  };

  // Handle Use Current Location button
  const handleUseCurrentLocation = async () => {
    try {
      setLocating(true);

      const position = await getBestCurrentLocation();

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      setCoordinates({
        latitude,
        longitude,
      });

      setLocationAccuracy(accuracy);

      const detectedAddress = await getAddressFromCoordinates(
        latitude,
        longitude
      );

      if (detectedAddress) {
        setAddress(detectedAddress);
      } else {
        setAddress(`${latitude}, ${longitude}`);
      }
    } catch (error) {
      alert(error.message || "Unable to detect your location.");
    } finally {
      setLocating(false);
    }
  };

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!product?._id) {
      alert("Product information is missing. Please select the product again.");
      return;
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      alert("Invalid product quantity.");
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

    if (!coordinates) {
      alert("Please use Current Location to confirm your delivery location.");
      return;
    }

    if (finalDeliveryCharge === null || finalTotal === null) {
      alert("Delivery charges could not be calculated. Please go back and try again.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await api.post("/orders", {
        product: product._id,
        quantity: Number(quantity),
        address: address.trim(),
        phone: phone.trim(),

        // These are submitted as client-side information.
        // The backend should independently verify the distance and charges.
        deliveryCharge: finalDeliveryCharge,
        distance,
        customerLocation: {
          type: "Point",
          coordinates: [
            coordinates.longitude,
            coordinates.latitude,
          ],
        },
      });

      alert("Your order has been placed successfully!");

      navigate("/orders", {
        replace: true,
        state: {
          order: response.data,
        },
      });
    } catch (error) {
      console.error("Place order error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // If someone opens Checkout directly without selecting a product
  if (!product) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <ShoppingBag size={50} className="text-gray-400 mb-4" />

          <h2 className="text-xl font-bold mb-2">
            No Product Selected
          </h2>

          <p className="text-gray-500 mb-5 text-center">
            Please select a product before proceeding to checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft size={22} />
            </button>

            <h1 className="text-2xl font-bold text-gray-800">
              Checkout
            </h1>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-green-600" />
              Order Summary
            </h2>

            <div className="flex gap-4 items-center">
              <img
                src={product.image || product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg bg-gray-100"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Quantity: {quantity}
                </p>

                <p className="text-green-700 font-semibold mt-1">
                  ₹{Number(product.price).toFixed(2)} × {quantity}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t mt-5 pt-4 space-y-3">

              <div className="flex justify-between text-gray-600">
                <span>Product Amount</span>

                <span>
                  ₹{productTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <Truck size={17} />
                  Delivery Distance
                </span>

                <span>
                  {formatDistance(distance)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>

                {finalDeliveryCharge === null ? (
                  <span className="text-red-600">
                    Not available
                  </span>
                ) : finalDeliveryCharge === 0 ? (
                  <span className="text-green-600 font-semibold">
                    FREE
                  </span>
                ) : (
                  <span>
                    ₹{finalDeliveryCharge.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-lg">
                  Total Amount
                </span>

                <span className="font-bold text-xl text-green-700">
                  {finalTotal !== null
                    ? `₹${finalTotal.toFixed(2)}`
                    : "Unavailable"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Delivery is free within 2 km. Charges depend on the
              distance between you and the shop.
            </p>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <h2 className="text-lg font-semibold mb-4">
              Delivery Information
            </h2>

            {/* Phone Number */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Mobile Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Address */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Delivery Address
            </label>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete delivery address"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Current Location Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="mt-4 w-full flex items-center justify-center gap-2 border border-green-600 text-green-700 font-medium py-3 rounded-lg hover:bg-green-50 disabled:opacity-60"
            >
              {locating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Detecting Location...
                </>
              ) : (
                <>
                  <LocateFixed size={18} />
                  Use Current Location
                </>
              )}
            </button>

            {/* Location Accuracy */}
            {coordinates && (
              <div className="mt-3 bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle size={17} />
                  Location detected successfully
                </p>

                {locationAccuracy !== null && (
                  <p className="text-xs text-gray-600 mt-1">
                    GPS accuracy: approximately{" "}
                    {Math.round(locationAccuracy)} metres
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={
              placingOrder ||
              locating ||
              finalDeliveryCharge === null ||
              finalTotal === null
            }
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {placingOrder ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Placing Order...
              </>
            ) : (
              `Place Order • ₹${
                finalTotal !== null ? finalTotal.toFixed(2) : "--"
              }`
            )}
          </button>

        </div>
      </div>
    </>
  );
};

export default Checkout;
