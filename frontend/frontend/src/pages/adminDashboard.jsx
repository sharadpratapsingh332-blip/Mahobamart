
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Users,
  ShoppingBag,
  Package,
  Store,
  IndianRupee,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalshops: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(
        "/admin/stats",
        { withCredentials: true }
      );

      console.log("result", res.data);

      setStats(res.data.stats || {});
    } catch (error) {
      console.log("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers ?? 0,
      icon: Users,
      color: "blue",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "purple",
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts ?? 0,
      icon: Package,
      color: "orange",
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Shops",
      value: stats.totalshops ?? stats.totalShops ?? 0,
      icon: Store,
      color: "green",
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(stats.totalRevenue ?? stats.revenue ?? 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "emerald",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  const managementLinks = [
    {
      title: "Users",
      description: "Manage registered users",
      path: "/admin/users",
      icon: Users,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Shops",
      description: "Manage local shops",
      path: "/admin/shops",
      icon: Store,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Products",
      description: "Manage listed products",
      path: "/admin/products",
      icon: Package,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Orders",
      description: "View and manage orders",
      path: "/admin/orders",
      icon: ShoppingBag,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-5 sm:py-8 lg:py-10">

          {/* Heading */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2.5 sm:p-3 rounded-xl">
                <LayoutDashboard
                  size={25}
                  className="text-green-700"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>

                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Manage your MahobaMart platform
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              Overview
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {statCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="min-w-0 bg-white border border-gray-100 shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className={`${item.bg} p-2 sm:p-3 rounded-lg sm:rounded-xl`}>
                        <Icon
                          size={20}
                          className={item.iconColor}
                        />
                      </div>
                    </div>

                    <h3 className="text-gray-500 text-xs sm:text-sm font-medium mt-3 sm:mt-4">
                      {item.title}
                    </h3>

                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 break-words">
                      {loading ? "..." : item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Management Links */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              Manage Platform
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {managementLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="flex items-center gap-3 sm:gap-4 bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                  >
                    <div className={`${item.bg} p-3 sm:p-4 rounded-xl shrink-0`}>
                      <Icon
                        size={24}
                        className={item.iconColor}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-gray-400 shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          </section>

        </div>
      </main>
    </>
  );
};

export default AdminDashboard;

