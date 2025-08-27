require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

const logger = require("./utils/logger");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const gameSocket = require("./sockets/gameSocket");

const app = express();
const server = http.createServer(app);

// 🔗 DB
connectDB();

// 🛡 middlewares HTTP
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// 🌐 Rutas REST
app.use("/api/auth", authRoutes);

// 🎮 Socket.IO (con CORS sencillo)
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// 🔌 Sockets
io.on("connection", (socket) => gameSocket(socket, io));

// 🚀 init
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.success(`Server running on port: ${PORT}`));