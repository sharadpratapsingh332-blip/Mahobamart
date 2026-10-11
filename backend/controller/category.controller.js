const Category = require("../models/category.model");
const Product = require("../models/product.model");


const createCategory = async (req, res) => {
  try {

    const { name } = req.body;

    const exists = await Category.findOne({
      name
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category =
      await Category.create({
        name
      });

    res.status(201).json({
      success: true,
      category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getCategories = async (req, res) => {
  try {

    const categories =
      await Category.find({
        status: true
      });

    res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


const getCategoryProducts = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const products = await Product.find({
      category: req.params.id
    })
      .populate("shop", "name address image");

    res.status(200).json({
      success: true,
      category,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryProducts
};