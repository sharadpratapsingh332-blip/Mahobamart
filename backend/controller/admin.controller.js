const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const shop = require("../models/shop.model")

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalshops = await shop.countDocuments();
      
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        totalshops
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

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


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllShops = async (req, res) => {
try {
console.log("Fetching all shops...");

const shops = await shop.find()
  .populate("owner", "name email phone")
  .populate("category", "name")
  .sort({ createdAt: -1 });

console.log("Shops fetched successfully:", shops.length);

return res.status(200).json({
  success: true,
  totalShops: shops.length,
  shops,
});


} catch (error) {
console.error("GET ALL SHOPS ERROR:", error);

return res.status(500).json({
  success: false,
  message: "Failed to fetch shops",
  error: error.message,
});


}
};




// DELETE SHOP (ADMIN)
const deleteAdminShop = async (req, res) => {
  try {
    const { id } = req.params;

    const Shop = await shop.findById(id);

    if (!Shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Remove products belonging to this shop.
    await Product.deleteMany({ shop: Shop._id });

    await shop.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Shop and its products deleted successfully",
    });
  } catch (error) {
       console.error("GET ALL SHOPS ERROR:", error);

          return res.status(500).json({
              success: false,
           message: "Failed to fetch shops",
          error: error.message,
          });

      }
};






module.exports = { getDashboardStats, getRecentOrders, getAllUsers , getAllShops ,deleteAdminShop };