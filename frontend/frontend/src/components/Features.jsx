
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

// Calculate distance between customer and shop
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const toRadians = (degree) => degree * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customer location
  const [customerLocation, setCustomerLocation] = useState(null);

  useEffect(() => {
    getProducts();
    getCustomerLocation();
  }, []);

  // Get customer location from browser
  const getCustomerLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Fetch products
  const getProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get distance for each product's shop
  const getProductDistance = (product) => {
    const coordinates = product.shop?.location?.coordinates;

    if (!customerLocation || !coordinates || coordinates.length < 2) {
      return null;
    }

    // MongoDB GeoJSON coordinates are [longitude, latitude]
    const [shopLongitude, shopLatitude] = coordinates;

    const distance = calculateDistance(
      customerLocation.latitude,
      customerLocation.longitude,
      shopLatitude,
      shopLongitude
    );

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m away`;
    }

    return `${distance.toFixed(1)} km away`;
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-5 sm:py-8">

      {/* Heading */}
      <div className="flex justify-between items-center gap-2 mb-5 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Popular Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Explore products from local stores
          </p>
        </div>

        <Link
          to="/products"
          className="shrink-0 text-green-600 font-semibold text-sm sm:text-base hover:text-green-700"
        >
          View All →
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-gray-100 animate-pulse h-56 sm:h-72"
            />
          ))}
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">

          {products.map((product) => {
            const distance = getProductDistance(product);

            return (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="min-w-0 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 border border-gray-100"
              >
                {/* Product Image */}
                <div className="w-full h-28 xs:h-32 sm:h-40 lg:h-52 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-2.5 sm:p-4">

                  <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 min-h-8">
                    {product.description || "Fresh quality product"}
                  </p>

                  {/* Shop Name */}
                  <p className="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-1">
                    From {product.shop?.name || "Local Store"}
                  </p>

                  {/* Shop Distance */}
                  <div className="flex items-center gap-1 mt-2 text-green-700 text-xs sm:text-sm font-medium">
                    <MapPin size={14} className="shrink-0" />

                    <span>
                      {distance || "Distance unavailable"}
                    </span>
                  </div>

                  <p className="text-green-600 font-bold text-base sm:text-lg mt-2">
                    ₹{product.price}
                  </p>

                  {/* Order Button */}
                  <div className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white text-center text-xs sm:text-sm font-semibold py-2 sm:py-2.5 rounded-lg transition">
                    Order Now
                  </div>

                </div>
              </Link>
            );
          })}

        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm sm:text-base">
            No products available right now.
          </p>
        </div>
      )}

    </section>
  );
};

export default ProductSection;
