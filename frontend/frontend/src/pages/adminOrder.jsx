
import { useEffect, useState } from "react";
import axios from "axios";
import {
  RefreshCw,
  Search,
  Package,
  IndianRupee,
  User,
  CalendarDays,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "/orders";

const STATUSES = [
  "Placed",
  "Accepted",
  "Preparing",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      const sortedOrders = (response.data.orders || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load orders. Please check your login and backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      const response = await axios.put(
        `${API_URL}/${orderId}`,
        { status },
        { withCredentials: true }
      );

      if (response.data.order) {
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? { ...order, ...response.data.order }
              : order
          )
        );
      } else {
        await fetchOrders();
      }

      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const values = [
      order.customer?.name || "",
      order.customer?.email || "",
      order.product?.name || "",
      order._id || "",
    ];

    const matchesSearch = values.some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    );

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyle = (status) => {
    const styles = {
      Placed: "bg-blue-100 text-blue-700",
      Accepted: "bg-indigo-100 text-indigo-700",
      Preparing: "bg-amber-100 text-amber-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

          {/* Back Button */}
          <Link
            to="/admin/dashboard"
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-50 sm:mb-7 sm:px-4"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Order Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track customer orders.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Orders
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 flex items-start gap-2 break-words rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-gray-600">
              <RefreshCw size={22} className="animate-spin" />
              <p>Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  {
                    title: "Total Orders",
                    count: orders.length,
                    color: "text-gray-900",
                  },
                  {
                    title: "Placed",
                    count: orders.filter((o) => o.status === "Placed").length,
                    color: "text-blue-600",
                  },
                  {
                    title: "Preparing",
                    count: orders.filter((o) => o.status === "Preparing").length,
                    color: "text-amber-600",
                  },
                  {
                    title: "Delivered",
                    count: orders.filter((o) => o.status === "Delivered").length,
                    color: "text-green-600",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="min-w-0 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-5"
                  >
                    <p className="text-xs font-medium text-gray-500 sm:text-sm">
                      {item.title}
                    </p>
                    <p className={`mt-2 text-2xl font-bold sm:text-3xl ${item.color}`}>
                      {item.count}
                    </p>
                  </div>
                ))}
              </section>

              {/* Search and Filter */}
              <section className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:p-4">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customer, product or order ID"
                    className="w-full min-w-0 rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-orange-500 sm:w-auto"
                >
                  <option value="All">All Statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </section>

              {/* Orders */}
              {filteredOrders.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white px-4 py-12 text-center">
                  <Package
                    size={42}
                    className="mx-auto mb-3 text-gray-300"
                  />
                  <h2 className="font-semibold text-gray-800">
                    No orders found
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <article
                      key={order._id}
                      className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col gap-3 border-b border-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                        <div className="min-w-0">
                          <p className="break-all text-xs font-semibold text-gray-800 sm:text-sm">
                            Order ID: {order._id}
                          </p>
                          <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                            <CalendarDays size={15} />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 gap-5 p-3 sm:p-5 md:grid-cols-2 lg:grid-cols-3">

                        {/* Customer */}
                        <div className="min-w-0">
                          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                            <User size={17} />
                            Customer Details
                          </h3>
                          <p className="break-words text-sm text-gray-700">
                            {order.customer?.name || "Unknown customer"}
                          </p>
                          <p className="mt-1 break-all text-sm text-gray-500">
                            {order.customer?.email || "No email"}
                          </p>
                          <p className="mt-2 break-words text-sm text-gray-600">
                            Phone: {order.phone || "N/A"}
                          </p>
                          <p className="mt-1 break-words text-sm text-gray-600">
                            Address: {order.address || "N/A"}
                          </p>
                        </div>

                        {/* Product */}
                        <div className="min-w-0">
                          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                            <Package size={17} />
                            Product Details
                          </h3>
                          <p className="break-words text-sm text-gray-700">
                            {order.product?.name || "Product unavailable"}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            Quantity: {order.quantity}
                          </p>
                          <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-gray-800">
                            <IndianRupee size={15} />
                            {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* Status Management */}
                        <div className="min-w-0">
                          <label
                            htmlFor={`status-${order._id}`}
                            className="mb-3 block font-semibold text-gray-800"
                          >
                            Update Order Status
                          </label>
                          <select
                            id={`status-${order._id}`}
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              updateStatus(order._id, e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-orange-500 disabled:opacity-50"
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {updatingId === order._id && (
                            <p className="mt-2 text-xs text-gray-500">
                              Updating status...
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminOrders;

