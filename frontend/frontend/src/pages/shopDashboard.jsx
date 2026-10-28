
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import socket from "../socket";

import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  IndianRupee,
  PlusCircle,
  Store,
  ClipboardList,
  Boxes,
  ArrowUpRight,
  RefreshCw,
  X,
  BellRing,
  MapPin,
  Phone,
} from "lucide-react";

import Navbar from "../components/Navbar";

const ShopDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newOrder, setNewOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/shops/dashboard");

      setStats((prev) => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error("Dashboard error:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Listen for new orders on the dashboard
  useEffect(() => {
    const handleNewOrder = (orderData) => {
      console.log("New order received:", orderData);
      setNewOrder(orderData);
      fetchDashboardStats();
    };

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("new-order", handleNewOrder);
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    socket.connect();

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [fetchDashboardStats]);

  // Accept or reject the order
  const handleOrderAction = async (status) => {
    if (!newOrder?.orderId || updatingOrder) return;

    try {
      setUpdatingOrder(true);

      await api.put(`/orders/${newOrder.orderId}`, { status });

      setNewOrder(null);
      await fetchDashboardStats();
    } catch (error) {
      console.error("Order update error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update this order. Please try again."
      );
    } finally {
      setUpdatingOrder(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Revenue",
      value: `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const actions = [
    {
      title: "Add Product",
      description: "Add a new product to your shop.",
      to: "/create-product",
      icon: PlusCircle,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      title: "My Shop",
      description: "View your shop details and products.",
      to: "/my-shop",
      icon: Store,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Shop Orders",
      description: "View and manage customer orders.",
      to: "/shop-orders",
      icon: ClipboardList,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Inventory",
      description: "Manage your product stock.",
      to: "/my-shop",
      icon: Boxes,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-emerald-600">
                SHOP OWNER PANEL
              </p>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Shop Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Manage your products, orders, and shop performance.
              </p>
            </div>

            <button
              onClick={fetchDashboardStats}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Stats
            </button>
          </div>

          {error && (
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>

              <button
                onClick={fetchDashboardStats}
                className="shrink-0 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-800 sm:text-xl">
              Overview
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 lg:p-6"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${stat.bg} ${stat.color}`}
                    >
                      <Icon size={20} />
                    </div>

                    <p className="mt-4 break-words text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                      {stat.title}
                    </p>

                    <p className="mt-1 break-words text-2xl font-extrabold text-slate-900 sm:text-3xl">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8 sm:mt-10">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose what you want to manage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
              {actions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:items-start sm:p-5"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${action.bg} ${action.color}`}
                    >
                      <Icon size={25} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-base font-bold text-slate-900 sm:text-lg">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {action.description}
                      </p>

                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                        Open
                        <ArrowUpRight
                          size={16}
                          className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:mt-10 sm:p-5">
            <p className="text-sm leading-6 text-emerald-900 sm:text-base">
              <span className="font-bold">Tip:</span> Keep your product
              prices and stock updated, and check pending orders regularly
              to provide better service to your customers.
            </p>
          </div>
        </div>
      </main>

      {/* New Order Popup */}
      {newOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-order-title"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="relative bg-emerald-700 px-6 py-6 text-white">
              <button
                type="button"
                onClick={() => setNewOrder(null)}
                disabled={updatingOrder}
                aria-label="Close notification"
                className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-white/15 disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <BellRing size={27} />
              </div>

              <p className="text-sm font-semibold text-emerald-100">
                MAHOBAMART ORDER ALERT
              </p>

              <h2
                id="new-order-title"
                className="mt-1 text-2xl font-extrabold"
              >
                New Order Received!
              </h2>

              <p className="mt-2 text-sm text-emerald-100">
                A customer has placed an order at your shop.
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Product
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {newOrder.productName || "New product order"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800">
                    × {newOrder.quantity || 1}
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-slate-200" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Order total
                  </span>

                  <span className="text-2xl font-extrabold text-emerald-700">
                    ₹
                    {Number(newOrder.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                {newOrder.orderId && (
                  <p className="mt-3 break-all text-xs text-slate-400">
                    Order ID: {newOrder.orderId}
                  </p>
                )}
              </div>

              {newOrder.message && (
                <p className="mt-4 text-center text-sm text-slate-600">
                  {newOrder.message}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleOrderAction("Accepted")}
                  disabled={updatingOrder}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle size={19} />
                  {updatingOrder ? "Updating..." : "Accept Order"}
                </button>

                <button
                  type="button"
                  onClick={() => handleOrderAction("Cancelled")}
                  disabled={updatingOrder}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3.5 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={19} />
                  Reject Order
                </button>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Accept the order to begin processing, or reject it to cancel.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopDashboard;
