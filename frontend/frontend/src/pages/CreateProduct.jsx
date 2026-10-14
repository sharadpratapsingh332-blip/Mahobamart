
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import { Package, X, ArrowLeft, ImagePlus } from "lucide-react";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get(
        "/categories"
      );

      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      alert("Failed to load categories. Please try again.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    if (price === "" || Number(price) < 0) {
      alert("Please enter a valid product price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (!image) {
      alert("Please select a product image.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("image", image);

      await api.post(
        "/products",
        formData,
        {
          withCredentials: true,
        }
      );

      alert("Product Created Successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage(null);

      const fileInput = document.getElementById("product-image");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Product creation error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create product. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-gray-50 px-3 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-3xl">

          {/* Top Left Close Button */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back to previous page"
              title="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 active:scale-95 sm:h-11 sm:w-11"
            >
              <X size={24} />
            </button>

          </div>

          {/* Product Form Card */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md sm:rounded-3xl">

            {/* Header */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-5 sm:px-7 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:h-12 sm:w-12">
                  <Package size={25} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                    Create Product
                  </h1>

                  <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                    Add a new product to your shop.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-4 sm:space-y-6 sm:p-7"
            >
              {/* Product Name */}
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="product-description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="product-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="product-price"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Price (₹) <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-stock"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Enter stock quantity"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="product-category"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  id="product-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  required
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>

                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Image */}
              <div>
                <label
                  htmlFor="product-image"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Product Image <span className="text-red-500">*</span>
                </label>

                <label
                  htmlFor="product-image"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-green-500 hover:bg-green-50 sm:py-8"
                >
                  <ImagePlus
                    size={32}
                    className="mb-2 text-green-600"
                  />

                  <span className="break-all text-sm font-semibold text-gray-700">
                    {image ? image.name : "Choose a product image"}
                  </span>

                  <span className="mt-1 text-xs text-gray-500">
                    Select an image from your device
                  </span>

                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files?.[0] || null)
                    }
                    className="sr-only"
                    required
                  />
                </label>

                {image && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);

                      const fileInput =
                        document.getElementById("product-image");

                      if (fileInput) {
                        fileInput.value = "";
                      }
                    }}
                    className="mt-2 text-sm font-medium text-red-600 hover:underline"
                  >
                    Remove selected image
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || loadingCategories}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
              >
                <Package size={20} />
                {submitting ? "Creating Product..." : "Create Product"}
              </button>

              <p className="text-center text-xs text-gray-500 sm:text-sm">
                Fields marked with <span className="text-red-500">*</span>{" "}
                are required.
              </p>
            </form>
          </section>
        </div>
      </main>
    </>
  );
};

export default CreateProduct;

