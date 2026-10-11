const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const {shopOnly} = require("../middlewares/shopOnly.middleware")

const {
  createShop,
    getShops,
    getShopProducts,
    getMyShop,
    getDashboardStats,
    updateShop
} = require("../controller/shop.controller");


router.get("/", getShops);

router.post(
  "/",
  auth,
  upload.single("image"),
  roleMiddleware("admin"),
  createShop
);

router.get("/:id/products", getShopProducts);


router.get(
  "/my-shop",
  auth,
  shopOnly,
  getMyShop
);

router.get(
  "/dashboard",
  auth,
  shopOnly,
  getDashboardStats
);


router.put(
  "/update",
  auth,
  shopOnly,
  upload.single("image"),
  updateShop
);


module.exports = router;