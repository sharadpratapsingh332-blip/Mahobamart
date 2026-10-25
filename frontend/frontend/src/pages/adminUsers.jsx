
import { useEffect, useState } from "react";
import api from "../api/axios";

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/users",
        { withCredentials: true }
      );

      setUsers(response.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-3 py-5 sm:px-6 sm:py-8 md:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-6">
            <Link
              to="/admin/dashboard"
              className="mb-5 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-50 sm:mb-7 sm:px-4"
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </Link>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                  Manage Users
                </h1>

                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  View all registered MahobaMart users.
                </p>
              </div>

              <button
                onClick={fetchUsers}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh Users
              </button>
            </div>
          </div>

          {/* Total Users */}
          <div className="mb-6 flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Users size={26} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Registered Users</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {users.length}
              </h2>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <RefreshCw
                className="mx-auto animate-spin text-green-600"
                size={30}
              />
              <p className="mt-3 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-red-600">{error}</p>

              <button
                onClick={fetchUsers}
                className="mt-4 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Mobile and Tablet Cards */}
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="min-w-0 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <Users size={23} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-bold text-gray-800 sm:text-lg">
                          {user.name || "Unnamed User"}
                        </h3>

                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                          {user.role || "customer"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                      <div className="flex items-start gap-3">
                        <Mail
                          size={18}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <p className="min-w-0 break-all text-sm text-gray-700">
                          {user.email || "No email available"}
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone
                          size={18}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <p className="break-words text-sm text-gray-700">
                          {user.phone || "No phone number"}
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarDays
                          size={18}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <p className="text-sm text-gray-700">
                          Registered: {formatDate(user.createdAt || user.updatedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          size={18}
                          className="shrink-0 text-gray-400"
                        />
                        <p className="text-xs text-gray-500">
                          User ID: {user._id}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                    No users found.
                  </div>
                )}
              </div>

              {/* Desktop Table */}
              <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-200 text-sm text-gray-700">
                      <tr>
                        <th className="whitespace-nowrap p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="whitespace-nowrap p-4">Phone</th>
                        <th className="p-4">Role</th>
                        <th className="whitespace-nowrap p-4">
                          Registered At
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-t border-gray-100 transition hover:bg-gray-50"
                        >
                          <td className="p-4 font-medium text-gray-800">
                            {user.name || "Unnamed User"}
                          </td>

                          <td className="max-w-xs break-all p-4 text-gray-600">
                            {user.email || "—"}
                          </td>

                          <td className="whitespace-nowrap p-4 text-gray-600">
                            {user.phone || "—"}
                          </td>

                          <td className="p-4">
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm capitalize text-blue-700">
                              {user.role || "customer"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap p-4 text-gray-600">
                            {formatDate(user.createdAt || user.updatedAt)}
                          </td>
                        </tr>
                      ))}

                      {users.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-gray-500"
                          >
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <p className="mt-5 text-center text-sm font-medium text-gray-600 sm:text-left">
            Total users: {users.length}
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;

