const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
const Category = require("../models/category.model");

const search = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    })
      .populate("category", "name")
      .limit(10);

    const shops = await Shop.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    }).limit(10);

    const categories = await Category.find({
      name: {
        $regex: keyword,
        $options: "i"
      }
    }).limit(10);

    res.status(200).json({
      success: true,
      keyword,
      products,
      shops,
      categories
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { search };