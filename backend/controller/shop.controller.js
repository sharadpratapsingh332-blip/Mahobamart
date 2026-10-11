const Shop = require("../models/shop.model");
const User = require("../models/user.model");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinari");
const Product = require("../models/product.model");
const Order = require("../models/order.model")

const createShop = async (req, res) => {
  try {
    let image = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "shops"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

      image = result.secure_url;
    }

    const {
      name,
      owner,
      category,
      phone,
      address,
      latitude,
      longitude
    } = req.body;

    const ownerExists = await User.findById(owner);

    if (!ownerExists) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }

    const shop = await Shop.create({
      name,
      owner,
      category,
      phone,
      address,
      image,

      location: {
        type: "Point",
        coordinates: [
          Number(longitude),
          Number(latitude)
        ]
      }
    });

    res.status(201).json({
      success: true,
      shop
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getShops = async (req, res) => {
  try {

    const shops = await Shop.find()
      .populate("category", "name")
      .populate("owner", "name email");

    res.status(200).json({
      success: true, 
      shops
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getShopProducts = async (req, res) => {
  try {

    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });
    }

    const products = await Product.find({
      shop: req.params.id
    });

    res.status(200).json({
      success: true,
      shop,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getMyShop = async (req, res) => {
  try {

    const shop = await Shop.findOne({
      owner: req.user.id
    })
    .populate("category", "name")
    .populate("owner", "name email");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });
    }

    const products = await Product.find({
      shop: shop._id
    })
    .populate("category", "name");

    res.status(200).json({
      success: true,
      shop,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getDashboardStats = async (req, res) => {
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

    const totalProducts =
      await Product.countDocuments({
        shop: shop._id
      });

    const totalOrders =
      await Order.countDocuments({
        shop: shop._id
      });

    const pendingOrders =
      await Order.countDocuments({
        shop: shop._id,
        status: {
          $in: [
            "Placed",
            "Accepted",
            "Preparing"
          ]
        }
      });

    const deliveredOrders =
      await Order.countDocuments({
        shop: shop._id,
        status: "Delivered"
      });

    const revenueData =
      await Order.find({
        shop: shop._id,
        status: "Delivered"
      });

    const revenue =
      revenueData.reduce(
        (total, order) =>
          total + order.totalAmount,
        0
      );

    res.status(200).json({
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      revenue
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



const updateShop = async (req, res) => {
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

    // Upload new image if selected
    if (req.file) {

      const result = await new Promise(
        (resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "shops"
              },
              (error, result) => {

                if (error) reject(error);
                else resolve(result);

              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);

        }
      );

      shop.image = result.secure_url;
    }

    shop.name =
      req.body.name || shop.name;

    shop.phone =
      req.body.phone || shop.phone;

    shop.address =
      req.body.address || shop.address;

    if (req.body.isOpen !== undefined) {
      shop.isOpen =
        req.body.isOpen === "true";
    }

    await shop.save();

    res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



module.exports = {
  createShop,
  getShops,
  getMyShop,
  getShopProducts,
  getDashboardStats,
  updateShop
};