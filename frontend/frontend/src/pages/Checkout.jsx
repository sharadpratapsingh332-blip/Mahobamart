
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

import { ArrowLeft, MapPin, Phone, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity } = location.state || {};

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // Return to the previous page
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

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

      await axios.post(
        "/orders",
        {
          product: product._id,
          quantity,
          address: address.trim(),
          phone: phone.trim(),
        },
        {
          withCredentials: true,
        }
      );

      alert("Order Placed Successfully");
      navigate("/orders");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to place order"
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
            className="mt-5 bg-green-600 text-white px-5 py-3 rounded-xl"
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


          {/* Page Heading */}
          <div className="mb-5 sm:mb-6 px-3">
             <button
            onClick={handleBack}
            className="inline-flex items-center bg-green-500 gap-2 text-gray-700  font-semibold px-5 py-2 -ml-2 rounded-lg transition hover:bg-green-600  mb-7"
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

          {/* Checkout Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">

            {/* Product Image */}
            <div className="w-full h-52 sm:h-64 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
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

              {/* Total */}
              <div className="flex justify-between items-center border-t border-gray-200 mt-4 pt-4">
                <span className="font-semibold text-gray-800">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-green-600">
                  ₹{product.price * quantity}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="mt-7">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Details
              </h3>

              {/* Phone Number */}
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

              {/* Delivery Address */}
              <div>
                <label
                  htmlFor="address"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MapPin size={18} />
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full min-w-0 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none p-3 sm:p-3.5 rounded-xl mt-2 text-base resize-y"
                  rows={3}
                  placeholder="House number, street, area, Mahoba..."
                />
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
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

