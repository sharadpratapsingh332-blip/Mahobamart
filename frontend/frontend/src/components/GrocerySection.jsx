
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { MapPin, ShoppingBasket } from "lucide-react";

const GrocerySection = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get("/shops");
      setShops(res.data.shops || []);
    } catch (error) {
      console.log("Error fetching grocery stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const groceryStores = shops.filter(
    (shop) => shop.category?.name?.toLowerCase() === "grocery"
  );

  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Heading */}
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:h-12 sm:w-12">
          <ShoppingBasket size={25} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            Popular Grocery Stores
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Daily essentials from your local stores
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-xl bg-gray-100 sm:rounded-2xl"
            >
              <div className="h-28 bg-gray-200 sm:h-40 lg:h-48" />
              <div className="space-y-2 p-3 sm:p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grocery Store Cards */}
      {!loading && groceryStores.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {groceryStores.map((shop) => (
            <Link
              key={shop._id}
              to={`/shop/${shop._id}`}
              className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl"
            >
              {/* Store Image */}
              <div className="relative overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  loading="lazy"
                  className="h-28 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-40 lg:h-48"
                />

                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-semibold sm:text-xs ${
                    shop.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {shop.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              {/* Store Details */}
              <div className="p-3 sm:p-4">
                <h3 className="truncate text-sm font-bold text-gray-900 group-hover:text-green-700 sm:text-lg">
                  {shop.name}
                </h3>

                <div className="mt-2 flex items-start gap-1.5 text-gray-500">
                  <MapPin size={14} className="mt-0.5 shrink-0 sm:h-4 sm:w-4" />
                  <p className="line-clamp-2 text-xs leading-relaxed sm:text-sm">
                    {shop.address || "Mahoba"}
                  </p>
                </div>

                <div className="mt-3 border-t border-gray-100 pt-3">
                  <span className="text-xs font-semibold text-green-700 sm:text-sm">
                    Explore Store →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && groceryStores.length === 0 && (
        <div className="rounded-xl bg-gray-50 px-4 py-10 text-center">
          <ShoppingBasket
            size={35}
            className="mx-auto mb-3 text-gray-400"
          />
          <h3 className="font-semibold text-gray-700">
            No grocery stores available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please check again later.
          </p>
        </div>
      )}
    </section>
  );
};

export default GrocerySection;