
require("dotenv").config();
const app = require("./app")
const connectDB = require("./config/database")

connectDB()

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})

