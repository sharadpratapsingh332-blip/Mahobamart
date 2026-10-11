const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
 const Category = require("../models/category.model");
 const streamifier = require("streamifier");
 const cloudinary = require("../config/cloudinari");

const createProduct = async (req, res) => {
  try {

  let image = "";
  
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
  
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products"
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
      description,
      price,
      category,
      stock
    } = req.body;

     const categoryExists = await Category.findById(category);

       if (!categoryExists) {
          return res.status(404).json({
            success: false,
             message: "Category not found"
        });
}


    const shopExists =  await Shop.findOne({
                      owner: req.user.id
               });

    console.log("Shop Exists:", shopExists);

if (!shopExists) {
  return res.status(404).json({
    success: false,
    message: "Shop not found"
  });
}

    const product = await Product.create({
      name,
      description,
      price,
      image,
      shop:shopExists._id,
      category,
      stock
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getProducts = async (req, res) => {
  try {

    const products = await Product.find({
      status: true
    })
    .populate("shop", "name")
    .populate("category", "name");

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


const getProduct = async (req, res) => {
  try {

    const product =
      await Product.findById(req.params.id)
      .populate("shop", "name")
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


const getNearbyProducts = async (req, res) => {
  try {
    console.log("Query:", req.query);

    const { latitude, longitude } = req.query;

    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              Number(longitude),
              Number(latitude)
            ]
          },
          $maxDistance: 7000
        }
      }
    });

    console.log("Shops Found:", shops.length);

    const shopIds = shops.map(
      (shop) => shop._id
    );

    const products = await Product.find({
      shop: { $in: shopIds }
    }).populate(
      "shop",
      "name address image"
    );

    console.log(
      "Products Found:",
      products.length
    );

    res.status(200).json({
      success: true,
      shops,
      products
    });

  } catch (error) {

    console.error(
      "NEARBY PRODUCTS ERROR:"
    );

    console.error(error);

    console.error(error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {

    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update image if a new image was uploaded
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

      product.image = result.secure_url;
    }

    // Update only the fields provided in the request
    if (req.body.name !== undefined) {
      product.name = req.body.name;
    }

    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }

    if (req.body.price !== undefined && req.body.price !== "") {
      product.price = Number(req.body.price);
    }

    if (req.body.stock !== undefined && req.body.stock !== "") {
      product.stock = Number(req.body.stock);
    }

    if (req.body.category !== undefined && req.body.category !== "") {
      product.category = req.body.category;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    getNearbyProducts
};