const shopOnly = (req, res, next) => {

  if (req.user.role !== "shop") {
    return res.status(403).json({
      success: false,
      message: "Only shop owners can access this"
    });
  }

  next();
};

module.exports = {shopOnly};