
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Package,
  RefreshCw,
  X,
  Save,
  ArrowLeft,
  Store,
  IndianRupee,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`/products`, {
        withCredentials: true,
      });

      const data = res.data;

      setProducts(
        Array.isArray(data) ? data : data.products || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEditForm = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
    });

    setImage(null);
    setError("");
    setSuccess("");
  };

  const closeEditForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImage(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === "" ||
      Number(form.price) < 0 ||
      Number(form.stock) < 0 ||
      !Number.isFinite(Number(form.price)) ||
      !Number.isFinite(Number(form.stock))
    ) {
      setError("Enter a valid name, price, and stock.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));

      if (form.category) {
        formData.append("category", form.category);
      }

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.put(
        `${API_URL}/products/${editingProduct._id}`,
        formData,
        { withCredentials: true }
      );

      const updatedProduct = res.data.product;

      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct._id
            ? {
                ...p,
                ...updatedProduct,
                shop: updatedProduct?.shop || p.shop,
                category: updatedProduct?.category || p.category,
              }
            : p
        )
      );

      closeEditForm();
      setSuccess("Product updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        withCredentials: true,
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setSuccess("Product deleted successfully!");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete product."
      );
    }
  };

  const getCategoryName = (category) => {
    if (!category) return "—";

    if (typeof category === "object") {
      return category.name || "—";
    }

    return category;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-gray-100">
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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Manage Products
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                View and manage products from all shops.
              </p>
            </div>

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Products
            </button>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-4 break-words rounded-xl bg-green-100 p-3 text-sm text-green-800">
              {success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 break-words rounded-xl bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Summary cards */}
          <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs text-gray-500 sm:text-sm">
                Total Products
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {products.length}
              </h2>
            </div>

            <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs text-gray-500 sm:text-sm">
                Management
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Package
                  size={22}
                  className="shrink-0 text-blue-600 sm:size-6"
                />

                <span className="text-sm font-semibold text-gray-800 sm:text-base">
                  All Shop Products
                </span>
              </div>
            </div>
          </section>

          {/* Loading */}
          {loading ? (
            <div className="rounded-xl bg-white p-10 text-center text-gray-500">
              <RefreshCw
                size={24}
                className="mx-auto mb-3 animate-spin"
              />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center">
              <Package
                className="mx-auto mb-3 text-gray-400"
                size={40}
              />

              <h2 className="text-lg font-semibold text-gray-700">
                No products found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products will appear here when available.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table: visible on large screens */}
              <div className="hidden overflow-x-auto rounded-xl bg-white shadow-sm lg:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-sm text-gray-600">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Shop</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || "/placeholder.png"}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />

                            <span className="font-medium text-gray-800">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-gray-600">
                          {product.shop?.name ||
                            product.shop?.shopName ||
                            "—"}
                        </td>

                        <td className="p-4 font-medium text-gray-800">
                          ₹{product.price ?? 0}
                        </td>

                        <td className="p-4 text-gray-600">
                          {product.stock ?? 0}
                        </td>

                        <td className="p-4 text-gray-600">
                          {getCategoryName(product.category)}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(product)}
                              title="Edit product"
                              aria-label={`Edit ${product.name}`}
                              className="inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              onClick={() => handleDelete(product._id)}
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              className="inline-flex rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet product cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                {products.map((product) => (
                  <article
                    key={product._id}
                    className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                  >
                    {/* Product image and name */}
                    <div className="flex items-start gap-3 p-3 sm:p-4">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 object-cover sm:h-24 sm:w-24"
                      />

                      <div className="min-w-0 flex-1">
                        <h2 className="break-words text-base font-bold text-gray-800 sm:text-lg">
                          {product.name}
                        </h2>

                        <p className="mt-1 flex items-center gap-1 text-lg font-bold text-green-700">
                          <IndianRupee size={17} />
                          {Number(product.price ?? 0).toLocaleString("en-IN")}
                        </p>

                        <p className="mt-1 break-words text-xs text-gray-500 sm:text-sm">
                          {getCategoryName(product.category)}
                        </p>
                      </div>
                    </div>

                    {/* Product information */}
                    <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50 p-3 sm:p-4">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Shop</p>

                        <p className="mt-1 break-words text-sm font-medium text-gray-800">
                          {product.shop?.name ||
                            product.shop?.shopName ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Available Stock</p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {product.stock ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 p-3 sm:p-4">
                      <button
                        onClick={() => openEditForm(product)}
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="my-auto max-h-[94dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl sm:max-h-[90vh] sm:max-w-xl sm:rounded-2xl sm:p-6">
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-center justify-between border-b bg-white p-4 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6">
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                Edit Product
              </h2>

              <button
                type="button"
                onClick={closeEditForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit form"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Product Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category ID or Name
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  placeholder="Enter category ID or name"
                  className="w-full rounded-lg border border-gray-300 p-3 text-base outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Product Image (optional)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                  className="w-full min-w-0 rounded-lg border border-gray-300 p-3 text-sm"
                />

                {image && (
                  <p className="mt-2 break-words text-sm text-gray-500">
                    New image: {image.name}
                  </p>
                )}

                {!image && editingProduct.image && (
                  <img
                    src={editingProduct.image}
                    alt="Current product"
                    className="mt-3 h-20 w-20 rounded-lg object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditForm}
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;

