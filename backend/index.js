require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const productRoutes = require("./Routes/productRoutes");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./Routes/userRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

module.exports.io = io;

app.set("io", io);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/token", tokenRoutes);

app.get("/", (req, res) => {
  res.send("API is running..");
});

connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
