import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { MapPin, Phone, Store } from "lucide-react";

const ShopDetails = () => {
  const { id } = useParams();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchShopProducts();
  }, [id]);

  const fetchShopProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/shops/${id}/products`
      );

      setShop(res.data.shop);
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  if (!shop) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
          <h1 className="text-2xl font-semibold">
            Loading Shop...
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Shop Details Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">

          {/* Left Side Image */}
          <div>
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-[300px] object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Right Side Details */}
          <div className="flex flex-col justify-center">

            <h1 className="text-4xl font-bold mb-6">
              {shop.name}
            </h1>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <MapPin
                  size={20}
                  className="text-green-600"
                />
                <span className="text-lg">
                  Shope Address : {shop.address}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={20}
                  className="text-green-600"
                />
                <span className="text-lg">
                 Contact No : {shop.phone}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Store
                  size={20}
                  className="text-green-600"
                />

                {shop.isOpen ? (
                  <span className="text-green-600 font-semibold text-lg">
                    Open Now
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold text-lg">
                    Closed
                  </span>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Products Section */}

        <h2 className="text-3xl font-bold mb-6">
          Products Available
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">

                  <h3 className="font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {product.description}
                  </p>

                  <p className="text-green-600 font-bold text-xl mt-3">
                    ₹{product.price}
                  </p>

                </div>

              </Link>
            ))}

          </div>
        )}

      </div>
    </>
  );
};

export default ShopDetails;