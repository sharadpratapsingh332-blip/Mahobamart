
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import {
  Store,
  MapPin,
  Phone,
  User,
  Package,
  IndianRupee,
  Pencil,
  Trash2,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";

const MyShop = () => {
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyShop();
  }, []);

  const fetchMyShop = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:3000/api/shops/my-shop",
        {
          withCredentials: true,
        }
      );

      setShop(res.data.shop);
      setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Failed to load your shop. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/products/${id}`,
        {
          withCredentials: true,
        }
      );

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      alert("Product deleted successfully");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <LoaderCircle
            size={40}
            className="animate-spin text-emerald-600"
          />
          <p className="mt-4 text-base font-medium text-gray-600 sm:text-lg">
            Loading your shop...
          </p>
        </div>
      </>
    );
  }

  if (error || !shop) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
          <Store
            size={44}
            className="mx-auto text-gray-400"
          />
          <h2 className="mt-4 text-xl font-bold text-gray-800 sm:text-2xl">
            Unable to Load Shop
          </h2>
          <p className="mt-2 break-words text-sm text-red-600 sm:text-base">
            {error || "No shop found for your account."}
          </p>
          <button
            onClick={fetchMyShop}
            className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">

          {/* Page Heading */}
          <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                SHOP OWNER DASHBOARD
              </p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                My Shop
              </h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Manage your shop and products in one place.
              </p>
            </div>

            <Link
              to="/edit-shop"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] sm:w-auto sm:text-base"
            >
              <Pencil size={18} />
              Edit Shop
            </Link>
          </div>

          {/* Shop Details */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="relative">
              <img
                src={shop.image}
                alt={shop.name}
                className="h-48 w-full object-cover sm:h-64 md:h-80"
              />

              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm sm:right-5 sm:top-5 sm:text-sm ${
                  shop.isOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {shop.isOpen ? "● Open" : "● Closed"}
              </span>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                    {shop.name}
                  </h2>

                  <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-600 sm:text-base">
                    <MapPin
                      size={19}
                      className="mt-1 shrink-0 text-emerald-600"
                    />
                    <span className="break-words">
                      {shop.address}
                    </span>
                  </p>
                </div>

                <Link
                  to="/edit-shop"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:text-base"
                >
                  <Pencil size={16} />
                  Edit Details
                </Link>
              </div>

              {/* Shop Information */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <Store
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 sm:text-sm">
                      Category
                    </p>
                    <p className="mt-1 break-words font-semibold text-gray-800">
                      {shop.category?.name || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <Phone
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 sm:text-sm">
                      Phone
                    </p>
                    <p className="mt-1 break-words font-semibold text-gray-800">
                      {shop.phone || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 rounded-xl bg-gray-50 p-4 sm:col-span-2 lg:col-span-1">
                  <User
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 sm:text-sm">
                      Shop Owner
                    </p>
                    <p className="mt-1 break-words font-semibold text-gray-800">
                      {shop.owner?.name || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Products Heading */}
          <section className="mt-8 sm:mt-10">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                  <ShoppingBag
                    size={25}
                    className="text-emerald-600"
                  />
                  My Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}{" "}
                  listed
                </p>
              </div>

              <Link
                to="/create-product"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98] sm:w-auto sm:text-base"
              >
                <Package size={18} />
                Add Product
              </Link>
            </div>

            {/* Empty Products */}
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center sm:px-8 sm:py-14">
                <Package
                  size={44}
                  className="mx-auto text-gray-300"
                />
                <h3 className="mt-4 text-lg font-bold text-gray-800 sm:text-xl">
                  No Products Yet
                </h3>
                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Add your first product to display it in your shop.
                </p>
                <Link
                  to="/create-product"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <article
                    key={product._id}
                    className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:shadow-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-48 w-full object-cover sm:h-52"
                    />

                    <div className="p-4 sm:p-5">
                      <h3 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                        {product.name}
                      </h3>

                      <p className="mt-2 min-h-[2.5rem] break-words text-sm leading-5 text-gray-500 line-clamp-2">
                        {product.description || "No description available."}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <p className="flex items-center text-xl font-bold text-emerald-600">
                          <IndianRupee size={18} />
                          {product.price}
                        </p>

                        <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 sm:text-sm">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <p className="mt-3 break-words text-sm text-gray-500">
                        Category:{" "}
                        <span className="font-medium text-gray-700">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </p>

                      {/* Product Actions */}
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            navigate(`/update-product/${product._id}`)
                          }
                          className="flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-2 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] sm:gap-2 sm:px-3"
                        >
                          <Pencil size={16} />
                          Update
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-2 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] sm:gap-2 sm:px-3"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default MyShop;
