
import { useState } from "react";
import api from "../api/axios";

import {
  Store,
  MapPin,
  ImagePlus,
  Phone,
  User,
  Tag,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

const CreateShop = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [gettingLocation, setGettingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getCurrentLocation = () => {
    setError("");
    setSuccess("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setGettingLocation(false);
        setSuccess("Location fetched successfully!");
      },
      (err) => {
        console.error("Location error:", err);
        setGettingLocation(false);

        if (err.code === 1) {
          setError(
            "Location permission denied. Allow location access in your browser settings."
          );
        } else if (err.code === 2) {
          setError("Your current location could not be determined.");
        } else {
          setError("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !category.trim() ||
      !owner.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!image) {
      setError("Please select a shop image.");
      return;
    }

    if (latitude === "" || longitude === "") {
      setError("Please fetch the shop's current location.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("category", category.trim());
      formData.append("owner", owner.trim());
      formData.append("phone", phone.trim());
      formData.append("address", address.trim());
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("image", image);

      const res = await axios.post(
        "/shops",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      setSuccess("Shop created successfully!");

      setName("");
      setCategory("");
      setOwner("");
      setPhone("");
      setAddress("");
      setImage(null);
      setImagePreview("");
      setLatitude("");
      setLongitude("");

      e.target.reset();
    } catch (err) {
      console.error("Error creating shop:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create shop. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <div className="mb-5 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 sm:h-16 sm:w-16">
            <Store size={30} />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            Create Shop
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Register a new shop on MahobaMart.
          </p>
        </div>

        {/* Form Card */}
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

            {/* Category and Owner */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Tag size={17} className="text-gray-400" />
                  Category ID <span className="text-red-500">*</span>
                </label>

                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category ID"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="owner"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <User size={17} className="text-gray-400" />
                  Owner ID <span className="text-red-500">*</span>
                </label>

                <input
                  id="owner"
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="Enter owner user ID"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>
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
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
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
              <label
                htmlFor="shopImage"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Shop Image <span className="text-red-500">*</span>
              </label>

              <label
                htmlFor="shopImage"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-green-500 hover:bg-green-50 sm:py-8"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Shop preview"
                    className="mb-3 h-36 w-full max-w-xs rounded-xl object-cover sm:h-44"
                  />
                ) : (
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <ImagePlus size={26} />
                  </div>
                )}

                <span className="max-w-full break-all text-sm font-semibold text-gray-700">
                  {image ? image.name : "Tap to upload shop image"}
                </span>

                <span className="mt-1 text-xs text-gray-500">
                  Select an image from your device
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

            {/* Location */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <MapPin size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800">
                    Shop Location
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Fetch the shop's location to save its coordinates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {gettingLocation ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <MapPin size={18} />
                )}

                {gettingLocation
                  ? "Getting Location..."
                  : "Use Current Location"}
              </button>

              {latitude !== "" && longitude !== "" && (
                <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-blue-100 bg-white p-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Latitude</p>
                    <p className="break-all text-sm font-medium text-gray-800">
                      {latitude}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Longitude</p>
                    <p className="break-all text-sm font-medium text-gray-800">
                      {longitude}
                    </p>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs font-medium text-green-700 sm:col-span-2">
                    <CheckCircle size={15} />
                    Location fetched successfully
                  </p>
                </div>
              )}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || gettingLocation}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
            >
              <Store size={20} />
              {submitting ? "Creating Shop..." : "Create Shop"}
            </button>

            <p className="text-center text-xs text-gray-400">
              Fields marked with * are required.
            </p>

          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateShop;

