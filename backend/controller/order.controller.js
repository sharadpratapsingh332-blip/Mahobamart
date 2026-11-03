const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Shop = require("../models/shop.model")


// Calculate distance between customer and shop using GPS coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometres

  const toRadians = (degree) => degree * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Calculate delivery charge according to distance
const calculateDeliveryCharge = (distance) => {
  if (distance <= 2) {
    return 15;
  }

  if (distance <= 5) {
    return 40;
  }

  if (distance <= 10) {
    return 60;
  }

  return null;
};

const createOrder = async (req, res) => {
  try {
    const {
      product,
      quantity,
      address,
      phone,
      customerLocation,
    } = req.body;

    // 1. Validate required fields
    if (!product || !quantity || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required order details",
      });
    }

    // 2. Validate quantity
    const orderQuantity = Number(quantity);

    if (
      !Number.isInteger(orderQuantity) ||
      orderQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product quantity",
      });
    }

    // 3. Validate phone number
    if (!/^[6-9]\d{9}$/.test(String(phone).trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    // 4. Get product details
    const productData = await Product.findById(product);

    if (!productData) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 5. Validate product price
    const productPrice = Number(productData.price);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product price",
      });
    }

    // 6. Get shop details
    const shop = await Shop.findById(productData.shop);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // 7. Get customer's GPS coordinates
    const customerCoordinates =
      customerLocation?.coordinates;

    if (
      customerLocation?.type !== "Point" ||
      !Array.isArray(customerCoordinates) ||
      customerCoordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid delivery location",
      });
    }

    // GeoJSON coordinates are [longitude, latitude]
    const customerLongitude = Number(customerCoordinates[0]);
    const customerLatitude = Number(customerCoordinates[1]);

    if (
      !Number.isFinite(customerLongitude) ||
      !Number.isFinite(customerLatitude) ||
      customerLongitude < -180 ||
      customerLongitude > 180 ||
      customerLatitude < -90 ||
      customerLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer GPS coordinates",
      });
    }

    // 8. Get shop GPS coordinates
    const shopCoordinates = shop.location?.coordinates;

    if (
      !Array.isArray(shopCoordinates) ||
      shopCoordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Shop location is not available",
      });
    }

    // GeoJSON coordinates are [longitude, latitude]
    const shopLongitude = Number(shopCoordinates[0]);
    const shopLatitude = Number(shopCoordinates[1]);

    if (
      !Number.isFinite(shopLongitude) ||
      !Number.isFinite(shopLatitude) ||
      shopLongitude < -180 ||
      shopLongitude > 180 ||
      shopLatitude < -90 ||
      shopLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop location",
      });
    }

    // 9. Calculate actual distance on backend
    const distance = calculateDistance(
      customerLatitude,
      customerLongitude,
      shopLatitude,
      shopLongitude
    );

    // 10. Calculate delivery charge on backend
    const deliveryCharge = calculateDeliveryCharge(distance);

    if (deliveryCharge === null) {
      return res.status(400).json({
        success: false,
        message: "Delivery is not available beyond 10 km",
        distance: Number(distance.toFixed(2)),
      });
    }

    // 11. Calculate final order amount
    const productTotal = productPrice * orderQuantity;

    const totalAmount = productTotal + deliveryCharge;

    // 12. Create order
    const order = await Order.create({
      customer: req.user.id,
      product: productData._id,
      shop: productData.shop,
      quantity: orderQuantity,
      productTotal,
      deliveryCharge,
      distance: Number(distance.toFixed(2)),
      totalAmount,
      address: address.trim(),
      phone: String(phone).trim(),
    });

    // 13. Notify the shop owner
    const io = req.app.get("io");

    if (io) {
      io.to(`shop:${productData.shop.toString()}`).emit(
        "new-order",
        {
          message: "You have received a new order!",
          orderId: order._id,
          productName: productData.name,
          quantity: order.quantity,
          totalAmount: order.totalAmount,
        }
      );
    }

    // 14. Send response
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {

    
    const orders = await Order.find({
      customer: req.user.id,
    }).populate("product", "name price image")
      .populate("shop", "name image");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Calculate the 10-minute deadline
    const tenMinutesAgo = new Date(
      Date.now() - 10 * 60 * 1000
    );

    // Find and cancel only the customer's eligible order
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        customer: req.user.id,
        status: "Placed",
        createdAt: { $gte: tenMinutesAgo }
      },
      {
        $set: {
          status: "Cancelled",
          cancelledAt: new Date()
        }
      },
      { new: true }
    );

    if (!order) {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      if (existingOrder.customer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You cannot cancel someone else's order"
        });
      }

      if (existingOrder.status !== "Placed") {
        return res.status(400).json({
          success: false,
          message: "Only orders with Placed status can be cancelled"
        });
      }

      return res.status(400).json({
        success: false,
        message: "Cancellation time has expired. You can cancel only within 10 minutes."
      });
    }

    // Notify the shop owner about cancellation
    const io = req.app.get("io");

if (io) {
  io.to(`shop:${order.shop.toString()}`).emit(
    "order-cancelled",
    {
      message: "A customer has cancelled an order.",
      orderId: order._id
    }
  );
}

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.log("CANCEL ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("product", "name price image");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Placed",
      "Accepted",
      "Preparing",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Find the order
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Admin can update any order
    if (req.user.role !== "admin") {
      // Only shop owners can update orders
      if (req.user.role !== "shop") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Find the shop owned by this user
      const Shop = require("../models/shop.model");

      const shop = await Shop.findOne({
        owner: req.user.id,
      });

      if (
        !shop ||
        order.shop.toString() !== shop._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only update orders for your own shop",
        });
      }
    }

    order.status = status;
    await order.save();

    await order.populate("customer", "name email");
    await order.populate("product", "name price image");

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getShopOrders = async (req, res) => {
  try {

    const shop = await Shop.findOne({
      owner: req.user.id
    });

    if (!shop) {
  return res.status(404).json({
    success: false,
    message: "Shop not found"
  });
}

    const orders = await Order.find({
      shop: shop._id
    })
    .populate("customer", "name phone")
    .populate("product", "name image");

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    
  console.log("SHOP ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};




module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getShopOrders,
  cancelOrder
};


