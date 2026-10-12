const express = require("express")
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const categoryRoutes =
require("./routes/category.routes");

const shopRoutes =
require("./routes/shop.routes");

const productRoutes =
require("./routes/product.routes");

const orderRoutes =
require("./routes/order.routes");

const adminRoutes = require("./routes/admin.routes");

const searchRoutes = require("./routes/search.routes");



const app= express()

app.get("/", (req, res) => {
  res.status(200).send("MahobaMart API is running!");
});

app.use(
  cors({
    origin: [
      "https://mahobamart.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use( "/api/categories",categoryRoutes);

app.use("/api/shops", shopRoutes);

app.use("/api/products", productRoutes);


app.use( "/api/orders", orderRoutes);

app.use( "/api/admin", adminRoutes);

app.use("/api/search", searchRoutes);

module.exports = app