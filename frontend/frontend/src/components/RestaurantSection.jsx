
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { MapPin, Clock ,UtensilsCrossed } from "lucide-react";

const RestaurantSection = () => {
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const restaurants = shops.filter(
    (shop) => shop.category?.name?.toLowerCase() === "food"
  );

  return (
    <section className="mx-auto max-w-7xl px-3 py-7 sm:px-6 sm:py-10 lg:px-8">
      {/* Heading */}
      <div className="mb-5 flex  items-center  gap-2 sm:mb-6">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:h-12 sm:w-12">
          <UtensilsCrossed size={25} />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            Popular Restaurants
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Discover local favourites in Mahoba
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-xl bg-gray-100 sm:rounded-2xl"
            >
              <div className="h-28 bg-gray-200 sm:h-44 lg:h-48" />
              <div className="space-y-2 p-3 sm:p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restaurant Cards */}
      {!loading && restaurants.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {restaurants.map((shop) => (
            <Link
              key={shop._id}
              to={`/shop/${shop._id}`}
              className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  loading="lazy"
                  className="h-28 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-40 lg:h-48"
                />

                {/* Open / Closed Badge */}
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

              {/* Details */}
              <div className="p-3 sm:p-4">
                <h3 className="truncate text-sm font-bold text-gray-900 group-hover:text-green-700 sm:text-lg">
                  {shop.name}
                </h3>

                <div className="mt-2 flex items-start gap-1.5 text-gray-500">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  <p className="line-clamp-2 text-xs leading-relaxed sm:text-sm">
                    {shop.address || "Mahoba"}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                  <Clock size={14} className="shrink-0" />
                  <span>Local restaurant</span>
                </div>

                <div className="mt-3 border-t border-gray-100 pt-3">
                  <span className="text-xs font-semibold text-green-700 sm:text-sm">
                    View Shop →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Restaurants */}
      {!loading && restaurants.length === 0 && (
        <div className="rounded-xl bg-gray-50 px-4 py-10 text-center">
          <p className="font-semibold text-gray-700">
            No restaurants available right now.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please check again later.
          </p>
        </div>
      )}
    </section>
  );
};

export default RestaurantSection;