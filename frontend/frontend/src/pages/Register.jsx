
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  UserPlus,
  Store,
  ShoppingBag,
} from "lucide-react";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", formData);

      alert(data.message || "Registration Successful");
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-100 px-3 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          to="/"
          className="mb-5 flex items-center justify-center gap-2 sm:mb-7"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-2xl font-black text-white shadow-sm">
            M
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="text-emerald-600">Mahoba</span>Mart
          </h1>
        </Link>

        {/* Registration Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8"
        >
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 sm:h-16 sm:w-16">
              <UserPlus size={30} />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Join MahobaMart and shop locally!
            </p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <UserRound size={19} className="shrink-0 text-gray-400" />

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full min-w-0 bg-transparent px-3 py-3 text-base outline-none"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <Phone size={19} className="shrink-0 text-gray-400" />

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="w-full min-w-0 bg-transparent px-3 py-3 text-base outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <Mail size={19} className="shrink-0 text-gray-400" />

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full min-w-0 bg-transparent px-3 py-3 text-base outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <LockKeyhole
                size={19}
                className="shrink-0 text-gray-400"
              />

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full min-w-0 bg-transparent px-3 py-3 text-base outline-none"
                required
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="mb-4">
            <label
              htmlFor="role"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "customer" })
                }
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                  formData.role === "customer"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ShoppingBag size={18} />
                Customer
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "shop" })
                }
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                  formData.role === "shop"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Store size={18} />
                Shop Owner
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label
              htmlFor="address"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Address
            </label>

            <div className="flex items-start rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <MapPin
                size={19}
                className="mt-3 shrink-0 text-gray-400"
              />

              <textarea
                id="address"
                name="address"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={handleChange}
                autoComplete="street-address"
                rows={2}
                className="w-full min-w-0 resize-y bg-transparent px-3 py-3 text-base outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          Local Delivery, Local Support 💚
        </p>
      </div>
    </div>
  );
};

export default Register;

