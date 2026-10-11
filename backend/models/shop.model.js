const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    phone: {
      type: String,
      required: true
    },

 address: {
  type: String,
  required: true
},

location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    required: true
  }
},

    image: {
      type: String,
      required: true,
    },

    isOpen: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model(
  "Shop",
  shopSchema
);