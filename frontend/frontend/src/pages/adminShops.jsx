
import { useEffect, useState } from "react";
import api from "../api/axios";

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Store,
  RefreshCw,
  MapPin,
  Phone,
  User,
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";


const initialForm = {
  name: "",
  owner: "",
  category: "",
  phone: "",
  address: "",
  latitude: "",
  longitude: "",
  image: null,
};

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [owners, setOwners] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchShops = async () => {
    const response = await axios.get(`/admin/shops`, {
      withCredentials: true,
    });

    setShops(response.data.shops || []);
  };

  const fetchFormOptions = async () => {
    const [usersResponse, categoriesResponse] = await Promise.all([
      axios.get(`/admin/users`, {
        withCredentials: true,
      }),
      axios.get(`/categories`, {
        withCredentials: true,
      }),
    ]);

    const allUsers = usersResponse.data.users || [];

    setOwners(allUsers.filter((user) => user.role === "shop"));

    const categoryData =
      categoriesResponse.data.categories || categoriesResponse.data;

    setCategories(Array.isArray(categoryData) ? categoryData : []);
  };

  const loadPage = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchShops(), fetchFormOptions()]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load shops or form options."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "image" ? files?.[0] || null : value,
    }));
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      const response = await axios.post(`${API}/shops`, data, {
        withCredentials: true,
      });

      setMessage(
        response.data.message || "Shop created successfully."
      );

      setForm({ ...initialForm });
      setShowForm(false);

      await fetchShops();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create shop."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShop = async (shop) => {
    const confirmed = window.confirm(
      `Delete "${shop.name}" and all its products? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(shop._id);
    setError("");
    setMessage("");

    try {
      const response = await axios.delete(
        `${API}/admin/shops/${shop._id}`,
        { withCredentials: true }
      );

      setShops((prev) =>
        prev.filter((item) => item._id !== shop._id)
      );

      setMessage(
        response.data.message || "Shop deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete shop."
      );
    } finally {
      setDeletingId("");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));

        setError("");
      },
      () => {
        setError(
          "Unable to get location. Allow location access or enter coordinates manually."
        );
      }
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-gray-50">
        <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

          {/* Back button */}
          <Link
            to="/admin/dashboard"
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50 sm:mb-7 sm:px-4"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          {/* Page header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Manage Shops
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Create, view, and manage MahobaMart shops.
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm((prev) => !prev);
                setError("");
                setMessage("");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
            >
              {showForm ? <X size={19} /> : <Plus size={19} />}
              {showForm ? "Close Form" : "Create New Shop"}
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-5 break-words rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 break-words rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Create Shop Form */}
          {showForm && (
            <form
              onSubmit={handleCreateShop}
              className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:p-7"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Create New Shop
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the shop details below.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Shop Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter shop name"
                    required
                    className="w-full min-w-0 rounded-lg border border-gray-300 p-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Shop Owner
                  </label>
                  <select
                    name="owner"
                    value={form.owner}
                    onChange={handleChange}
                    required
                    className="w-full min-w-0 rounded-lg border border-gray-300 bg-white p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select shop owner</option>
                    {owners.map((owner) => (
                      <option key={owner._id} value={owner._id}>
                        {owner.name} — {owner.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full min-w-0 rounded-lg border border-gray-300 bg-white p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Shop phone number"
                    required
                    className="w-full min-w-0 rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter full shop address"
                    required
                    rows={2}
                    className="w-full min-w-0 rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 26.3826"
                    required
                    className="w-full min-w-0 rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 79.875"
                    required
                    className="w-full min-w-0 rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 sm:w-auto"
              >
                <MapPin size={18} />
                Use My Current Location
              </button>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Shop Image
                </label>

                <div className="rounded-xl border border-dashed border-gray-300 p-3 sm:p-4">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    required
                    className="block w-full min-w-0 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700"
                  />

                  {form.image && (
                    <div className="mt-3 flex items-center gap-3">
                      <ImageIcon size={20} className="text-green-600" />
                      <span className="break-all text-sm text-gray-600">
                        {form.image.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {owners.length === 0 && (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  No users with the shop role were found. Register a shop-owner account first.
                </p>
              )}

              {categories.length === 0 && (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  No categories found. Create categories first.
                </p>
              )}

              <button
                type="submit"
                disabled={
                  saving ||
                  owners.length === 0 ||
                  categories.length === 0
                }
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {saving && <RefreshCw size={18} className="animate-spin" />}
                {saving ? "Creating Shop..." : "Create Shop"}
              </button>
            </form>
          )}

          {/* Shop list heading */}
          <div className="mb-4 mt-8 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              All Shops
              <span className="ml-2 text-base font-medium text-gray-500">
                ({shops.length})
              </span>
            </h2>

            <button
              onClick={loadPage}
              disabled={loading}
              aria-label="Refresh shops"
              className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
              <RefreshCw
                size={24}
                className="mx-auto mb-3 animate-spin"
              />
              Loading shops...
            </div>
          ) : shops.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm sm:p-12">
              <Store
                size={42}
                className="mx-auto mb-3 text-gray-300"
              />
              <h3 className="font-semibold text-gray-800">
                No shops found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first shop to see it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {shops.map((shop) => (
                <article
                  key={shop._id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Shop image */}
                  {shop.image ? (
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="h-44 w-full bg-gray-100 object-cover sm:h-48"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gray-100 text-sm text-gray-400 sm:h-48">
                      <div className="text-center">
                        <Store size={34} className="mx-auto mb-2" />
                        No shop image
                      </div>
                    </div>
                  )}

                  <div className="p-4 sm:p-5">
                    {/* Name and status */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 break-words text-lg font-bold text-gray-900 sm:text-xl">
                        {shop.name}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          shop.isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {shop.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    {/* Shop details */}
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <User
                          size={17}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Owner</p>
                          <p className="break-words text-sm font-medium text-gray-800">
                            {shop.owner?.name || "Unknown"}
                          </p>
                          {shop.owner?.email && (
                            <p className="mt-0.5 break-all text-xs text-gray-500">
                              {shop.owner.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Phone
                          size={17}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="break-words text-sm text-gray-800">
                            {shop.phone || shop.owner?.phone || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="break-words text-sm leading-5 text-gray-800">
                            {shop.address || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Store
                          size={17}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="break-words text-sm text-gray-800">
                            {shop.category?.name || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteShop(shop)}
                      disabled={deletingId === shop._id}
                      className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === shop._id ? (
                        <RefreshCw size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                      {deletingId === shop._id
                        ? "Deleting Shop..."
                        : "Delete Shop"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminShops;

