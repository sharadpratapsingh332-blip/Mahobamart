
import { useEffect, useState } from "react";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Phone,
  MapPin,
  ImagePlus,
  CheckCircle,
  LoaderCircle,
  ArrowLeft,
  Save,
} from "lucide-react";

const EditShop = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          "/shops/my-shop",
          {
            withCredentials: true,
          }
        );

        const shop = res.data.shop;

        setName(shop.name || "");
        setPhone(shop.phone || "");
        setAddress(shop.address || "");
        setIsOpen(shop.isOpen ?? true);
        setPreview(shop.image || "");
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load shop details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("address", address.trim());
      formData.append("isOpen", String(isOpen));

      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        "/shops/update",
        formData,
        {
          withCredentials: true,
        }
      );

      setSuccess("Shop updated successfully!");

      // Navigate after showing success feedback
      setTimeout(() => {
        navigate("/my-shop");
      }, 800);
    } catch (err) {
      console.error("Error updating shop:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update shop. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-gray-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">

          {/* Page Header */}
          <div className="mb-5 sm:mb-8">
            <button
              type="button"
              onClick={() => navigate("/my-shop")}
              className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              Back to My Shop
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:h-14 sm:w-14">
                <Store size={26} />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
                  Edit Shop
                </h1>
                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                  Update your shop information and status.
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <LoaderCircle
                size={32}
                className="mx-auto animate-spin text-green-600"
              />
              <p className="mt-3 text-sm text-gray-500">
                Loading shop details...
              </p>
            </div>
          ) : error && !name ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="break-words text-sm text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 md:p-8">

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Shop Name */}
                <div>
                  <label
                    htmlFor="shopName"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Shop Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="shopName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter shop name"
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <Phone size={17} className="text-gray-400" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    maxLength={15}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <MapPin size={17} className="text-gray-400" />
                    Shop Address <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete shop address"
                    rows={3}
                    maxLength={500}
                    required
                    className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Shop Image */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Shop Image
                  </label>

                  {preview && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={preview}
                        alt="Shop preview"
                        className="h-48 w-full object-cover sm:h-64"
                      />
                    </div>
                  )}

                  <label
                    htmlFor="shopImage"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition hover:border-green-500 hover:bg-green-50 sm:py-6"
                  >
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                      <ImagePlus size={24} />
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                      {image ? "Change selected image" : "Choose a new shop image"}
                    </span>

                    <span className="mt-1 max-w-full break-all text-xs text-gray-500">
                      {image ? image.name : "Leave unchanged to keep the current image"}
                    </span>

                    <input
                      id="shopImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Shop Status */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Shop Status
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Choose whether your shop is currently accepting orders.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(true)}
                      aria-pressed={isOpen}
                      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                        isOpen
                          ? "bg-green-600 text-white shadow-sm"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-green-50"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-pressed={!isOpen}
                      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                        !isOpen
                          ? "bg-red-600 text-white shadow-sm"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-red-50"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      Closed
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Current status:{" "}
                    <span
                      className={`font-semibold ${
                        isOpen ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {isOpen ? "Open for orders" : "Closed for orders"}
                    </span>
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="break-words rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div
                    role="status"
                    className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700"
                  >
                    <CheckCircle size={19} className="shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Update Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                >
                  {submitting ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}

                  {submitting ? "Updating Shop..." : "Update Shop"}
                </button>

              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default EditShop;

