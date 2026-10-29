
import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../socket";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft  } from "lucide-react";

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    fetchOrders();

    const handleNewOrder = (orderData) => {
      setNewOrder(orderData);
      fetchOrders();
    };

    socket.on("new-order", handleNewOrder);
    socket.connect();

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/shop-orders", {
        withCredentials: true,
      });

      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/orders/${orderId}`,
        { status },
        { withCredentials: true }
      );

      await fetchOrders();
      return true;
    } catch (error) {
      console.error("Update order status error:", error);
      alert(
        error.response?.data?.message ||
          "Could not update order status."
      );
      return false;
    }
  };

  const handleNotificationAction = async (status) => {
    if (!newOrder?.orderId) return;

    const success = await updateStatus(
      newOrder.orderId,
      status
    );

    if (success) {
      setNewOrder(null);
    }
  };

  return (
    <>
      <Navbar />

      {/* New Order Popup */}
      {newOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 text-4xl text-center">
              🔔
            </div>

            <h2 className="text-2xl font-bold text-center">
              New Order Received!
            </h2>

            <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4">
              <p>
                <strong>Product:</strong>{" "}
                {newOrder.productName}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {newOrder.quantity}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                ₹{newOrder.totalAmount}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  handleNotificationAction("Accepted")
                }
                className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
              >
                Accept Order
              </button>

              <button
                onClick={() =>
                  handleNotificationAction("Cancelled")
                }
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-10">
          
          <Link
            to="/shop-dashboard"
            className="mb-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98] sm:mb-8 sm:text-base"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

        <h1 className="mb-8 text-4xl font-bold">
          Shop Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow">
            No Orders Found
          </div>
        ) : (
          <div className="grid gap-6">
            {[...orders].reverse().map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-xl bg-white shadow-lg"
              >
                <div className="md:flex">
                  <img
                    src={order.product?.image}
                    alt={order.product?.name || "Product"}
                    className="h-64 w-full object-cover md:w-64"
                  />

                  <div className="flex-1 p-6">
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
                        <span className="font-bold text-green-600">
                          {order.status}
                        </span>
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status === "Placed" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(order._id, "Accepted")
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                          >
                            Accept Order
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(order._id, "Cancelled")
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}

                      {order.status === "Accepted" && (
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Preparing")
                          }
                          className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                        >
                          Mark Preparing
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Out For Delivery")
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                         Out For Delivery
                        </button>
                      )}

                      {order.status === "Out For Delivery" && (
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Delivered")
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                          Mark Delivered
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
