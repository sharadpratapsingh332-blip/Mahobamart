const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  getDashboardStats,
  getRecentOrders,
  getAllUsers,
  getAllShops,
  deleteAdminShop
} = require("../controller/admin.controller");
const adminOnly = require("../middlewares/admin.middleware");

router.get(
  "/stats",
  auth,
  adminOnly,
  getDashboardStats
);

router.get(
  "/recent-orders",
  auth,
  roleMiddleware("admin"),
  getRecentOrders
);

router.get(
  "/users",
  auth,
  adminOnly,
  getAllUsers
);

router.get("/shops", auth, adminOnly, getAllShops);

router.delete(
  "/shops/:id",
  auth,
  adminOnly,
  deleteAdminShop
);

module.exports = router;