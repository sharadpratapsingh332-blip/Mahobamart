
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const Shop = require("./models/shop.model");

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://mahobamart.vercel.app",
    ],
    credentials: true,
  },
});


app.set("io", io);

io.use(async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";

    const tokenCookie = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("token="));

    if (!tokenCookie) {
      return next(new Error("Please login first"));
    }

    const token = decodeURIComponent(
      tokenCookie.substring("token=".length)
    );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.data.user = {
      id: user._id.toString(),
      role: user.role,
    };

    if (user.role === "shop") {
      const shop = await Shop.findOne({ owner: user._id });

      if (!shop) {
        return next(new Error("Shop not found"));
      }

      socket.data.shopId = shop._id.toString();
    }

    next();
  } catch (error) {
    next(new Error("Unauthorized socket connection"));
  }
});

io.on("connection", (socket) => {
  console.log("Authenticated socket connected:", socket.id);

 if (socket.data.user.role === "shop" && socket.data.shopId) {
  socket.join(`shop:${socket.data.shopId}`);
}

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
