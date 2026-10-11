const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const {shopOnly} =require("../middlewares/shopOnly.middleware");
const {
  createProduct,
    getProducts,
    getProduct,
    getNearbyProducts,
    deleteProduct,
    updateProduct
} = require("../controller/product.controller");

router.post(
  "/",
   auth,
   upload.single("image"),
   shopOnly,
   createProduct
);

router.get(
  "/",
  getProducts
);

router.get("/nearby", getNearbyProducts);

router.get("/:id", getProduct);

router.put(
  "/:id",
  auth,
  shopOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
   "/:id",
    auth,
   shopOnly,
  deleteProduct
);



module.exports = router;