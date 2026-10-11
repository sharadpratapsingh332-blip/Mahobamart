const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      default: 1
    },

    totalAmount: {
      type: Number,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Placed",
        "Accepted",
        "Preparing",
        "Delivered",
        "Cancelled"
      ],
      default: "Placed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);