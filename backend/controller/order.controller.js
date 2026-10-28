const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Shop = require("../models/shop.model")

const createOrder = async (req, res) => {
  try {


    const {
      product,
      quantity,
      address,
      phone
    } = req.body;

    const productData =
      await Product.findById(product);

    if (!productData) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const totalAmount =
      productData.price * quantity;

    const order =
      await Order.create({
        customer: req.user.id,
        product,
        shop: productData.shop,
        quantity,
        totalAmount,
        address,
        phone
      });

    const io = req.app.get("io");

io.to(`shop:${productData.shop.toString()}`).emit("new-order", {
  message: "You have received a new order!",
  orderId: order._id,
  productName: productData.name,
  quantity: order.quantity,
  totalAmount: order.totalAmount,
});

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
        console.log("CREATE PRODUCT ERROR:");
         console.log(error);

         res.status(500).json({
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
  getShopOrders
};


