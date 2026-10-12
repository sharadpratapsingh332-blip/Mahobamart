import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ShopOrders = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {

      const res = await axios.get(
        "/orders/shop-orders",
        {
          withCredentials: true
        }
      );

      setOrders(res.data.orders);

    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {

      await axios.put(
        `/orders/${orderId}`,
        { status },
        {
          withCredentials: true
        }
      );

      fetchOrders();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          Shop Orders
        </h1>

        {orders.length === 0 ? (

          <div className="bg-white p-6 rounded-xl shadow">
            No Orders Found
          </div>

        ) : (

          <div className="grid gap-6">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >

                <div className="md:flex">

                  {/* Product Image */}
                  <img
                    src={order.product?.image}
                    alt={order.product?.name}
                    className="w-full md:w-64 h-64 object-cover"
                  />

                  {/* Order Details */}
                  <div className="p-6 flex-1">

                    <h2 className="text-2xl font-bold">
                      {order.product?.name}
                    </h2>

                    <div className="mt-4 space-y-2">

                      <p>
                        <strong>Customer:</strong>{" "}
                        {order.customer?.name}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {order.customer?.phone}
                      </p>

                      <p>
                        <strong>Address:</strong>{" "}
                        {order.address}
                      </p>

                      <p>
                        <strong>Quantity:</strong>{" "}
                        {order.quantity}
                      </p>

                      <p>
                        <strong>Total Amount:</strong>{" "}
                        ₹{order.totalAmount}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="text-green-600 font-bold">
                          {order.status}
                        </span>
                      </p>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 flex-wrap">

                      {order.status === "Placed" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Accepted"
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          Accept Order
                        </button>
                      )}

                      {order.status === "Accepted" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Preparing"
                            )
                          }
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                        >
                          Mark Preparing
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Delivered"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {(order.status === "Placed" ||
                        order.status === "Accepted") && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Cancelled"
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Cancel Order
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </>
  );
};

export default ShopOrders;