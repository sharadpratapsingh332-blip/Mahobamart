
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "/shops/dashboard",
        { withCredentials: true }
      );

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
          {/* Page Heading */}
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

          {/* Error Message */}
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

          {/* Statistics */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-800 sm:text-xl">
              Overview
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 lg:p-6"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${stat.bg} ${stat.color}`}
                      >
                        <Icon size={20} />
                      </div>
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

          {/* Quick Actions */}
          <section className="mt-8 sm:mt-10">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose what you want to manage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-2 xl:grid-cols-4">
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

          {/* Bottom Note */}
          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:mt-10 sm:p-5">
            <p className="text-sm leading-6 text-emerald-900 sm:text-base">
              <span className="font-bold">Tip:</span> Keep your product
              prices and stock updated, and check pending orders regularly
              to provide better service to your customers.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShopDashboard;

