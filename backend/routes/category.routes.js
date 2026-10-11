const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  createCategory,
    getCategories,
    getCategoryProducts
} = require(
  "../controller/category.controller"
);

router.post(
  "/",
  auth,
  roleMiddleware("admin"),
  createCategory
);

router.get(
  "/",
  getCategories
);

router.get("/:id/products", getCategoryProducts);


module.exports = router;