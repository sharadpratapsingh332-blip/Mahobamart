
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

    // Product price multiplied by quantity
    productTotal: {
      type: Number,
      required: true
    },

    // Delivery charge based on distance
    deliveryCharge: {
      type: Number,
      required: true,
      default: 0
    },

    // Distance between customer and shop in kilometres
    distance: {
      type: Number,
      required: true
    },

    // Product total + delivery charge
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
        "Out For Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Placed"
    },

    // Record when the customer cancels the order
    cancelledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
