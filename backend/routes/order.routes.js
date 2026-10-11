const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");

const roleMiddleware = require("../middlewares/role.middleware");

const {shopOnly} = require ("../middlewares/shopOnly.middleware")

const {
  createOrder,
  getUserOrders,
  getAllOrders ,
  updateOrderStatus,
  getShopOrders
} = require(
  "../controller/order.controller"
);

router.post(
  "/",
  auth,
  createOrder
);

router.get("/my-orders", auth, getUserOrders);


router.get(
  "/",
  auth,
  roleMiddleware("admin"),
  getAllOrders
);

router.put(
  "/:id",
  auth,
  updateOrderStatus
);

router.get(
  "/shop-orders",
  auth,
  shopOnly,
  getShopOrders
);

module.exports = router;