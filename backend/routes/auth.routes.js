const express = require("express");


const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  getme,
  getCurrentUser
} = require("../controller/user.controller");

const auth =
require("../middlewares/auth.middleware");

router.get(
  "/profile",
  auth,
  getProfile
);

router.get(
  "/me",
  auth,
  getme
);

router.get(
  "/current",
  auth,
  getCurrentUser
);

router.post(
  "/register",
  registerUser
);


router.post(
  "/login",
  loginUser
);

module.exports = router;