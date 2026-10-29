
import { useEffect, useState } from "react";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  Package,
  MapPin,
  Phone,
  Store,
  ArrowLeft,
  IndianRupee,
  CalendarDays,
  LoaderCircle,
  ShoppingBag,
  CheckCircle2,
  Circle,
  Clock,
  ChefHat,
  Bike,
  XCircle,
  Navigation,
  Truck,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/orders/my-orders", {
        withCredentials: true,
      });

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Order progress steps
  const trackingSteps = [
    {
      status: "Placed",
      title: "Order Placed",
      description: "Your order has been received.",
      icon: ShoppingBag,
    },
    {
      status: "Accepted",
      title: "Accepted by Shop",
      description: "The shop has accepted your order.",
      icon: CheckCircle2,
    },
    {
      status: "Preparing",
      title: "Preparing Your Order",
      description: "The shop is preparing your items.",
      icon: ChefHat,
    },
    {
      status: "Out for Delivery",
      title: "Out for Delivery",
      description: "Your order is on its way.",
      icon: Bike,
    },
    {
      status: "Delivered",
      title: "Delivered",
      description: "Enjoy your order!",
      icon: CheckCircle2,
    },
  ];

  // Supports the status names used by the existing order system
  const normalizeStatus = (status) => {
    const value = String(status || "").trim().toLowerCase();

    const statusMap = {
      placed: "Placed",
      pending: "Placed",
      accepted: "Accepted",
      preparing: "Preparing",
      "out for delivery": "Out for Delivery",
      outfordelivery: "Out for Delivery",
      dispatched: "Out for Delivery",
      shipped: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      canceled: "Cancelled",
    };

    return statusMap[value] || "Placed";
  };

  const getStepIndex = (status) => {
    const normalized = normalizeStatus(status);
    return trackingSteps.findIndex(
      (step) => step.status === normalized
    );
  };

  const getStatusStyle = (status) => {
    const normalized = normalizeStatus(status);

    const styles = {
      Placed: "bg-yellow-100 text-yellow-800",
      Accepted: "bg-blue-100 text-blue-800",
      Preparing: "bg-purple-100 text-purple-800",
      "Out for Delivery": "bg-sky-100 text-sky-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };

    return styles[normalized] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <p className="mt-4 text-gray-600">
            Loading your orders...
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

          {/* Back Button */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98] sm:mb-8 sm:text-base"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          {/* Heading */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:h-14 sm:w-14">
                <ShoppingBag size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                  My Orders
                </h1>
                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                  Track and manage your orders.
                </p>
              </div>
            </div>

            {!error && (
              <p className="mt-4 text-sm text-gray-600">
                Total orders:{" "}
                <span className="font-bold text-green-700">
                  {orders.length}
                </span>
              </p>
            )}
          </div>

          {/* Error */}
          {error ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
              <p className="break-words text-red-600">{error}</p>

              <button
                onClick={fetchOrders}
                className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            /* Empty Orders */
            <div className="rounded-2xl bg-white px-4 py-10 text-center shadow-sm sm:px-8 sm:py-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 sm:h-20 sm:w-20">
                <Package size={38} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-800 sm:text-2xl">
                No Orders Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 sm:text-base">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                <ShoppingBag size={18} />
                Start Shopping
              </Link>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4 sm:space-y-6">
              {[...orders]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
                )
                .map((order) => {
                  const status = normalizeStatus(order.status);
                  const currentStep = getStepIndex(order.status);
                  const isCancelled = status === "Cancelled";
                  const isDelivered = status === "Delivered";
                  const isExpanded = expandedOrder === order._id;

                  return (
                    <article
                      key={order._id}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                    >
                      <div className="p-4 sm:p-5 lg:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                          {/* Product Image */}
                          <div className="w-full shrink-0 sm:w-40 lg:w-48">
                            <img
                              src={order.product?.image}
                              alt={order.product?.name || "Ordered product"}
                              loading="lazy"
                              className="h-48 w-full rounded-xl bg-gray-100 object-cover sm:h-40 lg:h-44"
                            />
                          </div>

                          {/* Order Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <h2 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">
                                  {order.product?.name ||
                                    "Product unavailable"}
                                </h2>

                                <p className="mt-2 flex items-start gap-2 text-sm text-gray-600 sm:text-base">
                                  <Store
                                    size={18}
                                    className="mt-0.5 shrink-0 text-green-600"
                                  />
                                  <span className="break-words">
                                    Shop: {order.shop?.name || "Shop unavailable"}
                                  </span>
                                </p>

                                <p className="mt-2 break-all text-xs text-gray-400">
                                  Order ID: {order._id}
                                </p>
                              </div>

                              <span
                                className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${getStatusStyle(
                                  order.status
                                )}`}
                              >
                                {status}
                              </span>
                            </div>

                            {/* Price and Quantity */}
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4">
                              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                                <p className="text-xs text-gray-500 sm:text-sm">
                                  Quantity
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                  {order.quantity}
                                </p>
                              </div>

                              <div className="rounded-xl bg-green-50 p-3 sm:p-4">
                                <p className="text-xs text-gray-500 sm:text-sm">
                                  Total Amount
                                </p>
                                <p className="mt-1 flex items-center text-lg font-bold text-green-700 sm:text-xl">
                                  <IndianRupee size={17} />
                                  {order.totalAmount}
                                </p>
                              </div>
                            </div>

                            {/* Contact and Address */}
                            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                              <p className="flex items-start gap-2 text-sm text-gray-600 sm:text-base">
                                <Phone
                                  size={17}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                />
                                <span className="break-words">
                                  <strong className="text-gray-800">
                                    Phone:
                                  </strong>{" "}
                                  {order.phone}
                                </span>
                              </p>

                              <p className="flex items-start gap-2 text-sm leading-6 text-gray-600 sm:text-base">
                                <MapPin
                                  size={18}
                                  className="mt-1 shrink-0 text-gray-400"
                                />
                                <span className="min-w-0 break-words">
                                  <strong className="text-gray-800">
                                    Delivery Address:
                                  </strong>{" "}
                                  {order.address}
                                </span>
                              </p>
                            </div>

                            {/* Order Date */}
                            {order.createdAt && (
                              <p className="mt-4 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                                <CalendarDays size={16} />
                                Ordered on {formatDate(order.createdAt)}
                              </p>
                            )}

                            {/* Track Order Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrder(
                                  isExpanded ? null : order._id
                                )
                              }
                              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 active:scale-[0.99] sm:w-auto"
                              aria-expanded={isExpanded}
                            >
                              <Navigation size={18} />
                              {isExpanded ? "Hide Tracking" : "Track Order"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Horizontal Tracking Timeline */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gradient-to-br from-green-50/80 to-white p-4 sm:p-6 lg:p-8">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                                <Truck size={25} />
                              </div>

                              <div>
                                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                  Track Your Order
                                </h3>
                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                  Order ID: {order._id}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {isCancelled ? (
                                <XCircle size={17} />
                              ) : isDelivered ? (
                                <CheckCircle2 size={17} />
                              ) : (
                                <Clock size={17} />
                              )}
                              {status}
                            </span>
                          </div>

                          {isCancelled ? (
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                              <XCircle size={24} className="shrink-0" />
                              <div>
                                <h4 className="font-bold">
                                  Order Cancelled
                                </h4>
                                <p className="mt-1 text-sm">
                                  This order has been cancelled. Normal delivery
                                  tracking is no longer available.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="mt-8 overflow-x-auto pb-3">
                                <div className="min-w-[650px] px-2 sm:min-w-0">
                                  {/* Progress line and checkpoints */}
                                  <div className="relative">
                                    <div className="absolute left-[10%] right-[10%] top-5 h-1 rounded-full bg-gray-200" />

                                    <div
                                      className="absolute left-[10%] top-5 h-1 rounded-full bg-green-600 transition-all duration-500"
                                      style={{
                                        width: `${
                                          (Math.max(currentStep, 0) / 4) * 80
                                        }%`,
                                      }}
                                    />

                                    <div className="relative grid grid-cols-5">
                                      {trackingSteps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        const isCompleted =
                                          index < currentStep || isDelivered;
                                        const isCurrent =
                                          index === currentStep &&
                                          !isDelivered;

                                        return (
                                          <div
                                            key={step.status}
                                            className="flex min-w-0 flex-col items-center text-center"
                                          >
                                            <div
                                              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-12 sm:w-12 ${
                                                isCompleted
                                                  ? "border-green-600 bg-green-600 text-white"
                                                  : isCurrent
                                                  ? "border-green-600 bg-green-600 text-white ring-4 ring-green-100"
                                                  : "border-gray-200 bg-gray-100 text-gray-400"
                                              }`}
                                            >
                                              {isCompleted ? (
                                                <CheckCircle2 size={23} />
                                              ) : (
                                                <StepIcon size={21} />
                                              )}
                                            </div>

                                            <h4
                                              className={`mt-4 max-w-32 text-xs font-bold sm:text-sm ${
                                                isCompleted || isCurrent
                                                  ? "text-green-800"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              {step.title}
                                            </h4>

                                            <p className="mt-2 max-w-32 text-xs leading-5 text-gray-500">
                                              {step.description}
                                            </p>

                                            {isCurrent && (
                                              <span className="mt-2 rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700 sm:text-xs">
                                                Current Status
                                              </span>
                                            )}

                                            {isDelivered && index === 4 && (
                                              <span className="mt-2 rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700 sm:text-xs">
                                                Completed
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <p className="mt-3 text-center text-xs text-gray-500">
                                {isDelivered
                                  ? "Your order has been delivered successfully."
                                  : "Your tracking progress follows the latest order status."}
                              </p>
                            </>
                          )}

                          {/* Tracking details */}
                          <div className="mt-6 grid gap-3 border-t border-gray-200 pt-5 sm:grid-cols-3 sm:gap-4">
                            <div className="flex items-start gap-3 rounded-xl bg-white p-3">
                              <Store
                                size={20}
                                className="mt-1 shrink-0 text-green-700"
                              />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500">
                                  Shop Name
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                                  {order.shop?.name || "Shop unavailable"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-white p-3">
                              <Package
                                size={20}
                                className="mt-1 shrink-0 text-green-700"
                              />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500">
                                  Items
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                                  {order.product?.name || "Product unavailable"}{" "}
                                  × {order.quantity}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-white p-3">
                              <MapPin
                                size={20}
                                className="mt-1 shrink-0 text-green-700"
                              />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500">
                                  Delivery Address
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                                  {order.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Orders;
