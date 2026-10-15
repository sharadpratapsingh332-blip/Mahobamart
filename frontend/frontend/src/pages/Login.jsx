
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  LogIn,
  Eye,
  EyeOff,
  ShoppingBag,
} from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/authcontext";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      const { data } = await api.post("/auth/login", formData, {
        withCredentials: true,
      });

      setUser(data.user);

      if (data.user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <> 
    <Navbar/>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-100 px-3 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-md">

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8"
        >
          {/* Heading */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 sm:h-16 sm:w-16">
              <LogIn size={30} />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Welcome Back!
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Login to continue shopping locally.
            </p>
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
          <div className="mb-6">
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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full min-w-0 bg-transparent px-3 py-3 text-base outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 rounded-lg p-1 text-gray-400 hover:text-emerald-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <ShoppingBag size={19} />
                Login to MahobaMart
              </>
            )}
          </button>

          {/* Register Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-emerald-700 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-gray-500">
          Local Delivery, Local Support 💚
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
