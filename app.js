import express from "express";
import pool from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import authRouter from "./routes/authRoutes.js";
import { connection } from "./socket/connection.js";
dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.url || "http://localhost:5173",
    credentials: true,
  })
);

const server = http.createServer(app);

app.use("/api/auth", authRouter);

const io = new Server(server, {
  cors: {
    origin: process.env.url || "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET"],
  },
});
connection(io);

app.use((req, res) => {
  res.status(404).json({
    message: "page not found",
  });
});
const PORT = process.env.PORT || 2002;

server.listen(PORT, () => {
  (async () => {
    try {
      const connect = await pool.getConnection();
      console.log("connection established");
      connect.release();
    } catch (err) {
      console.log("not connected to database", err.message);
    }
  })();
  console.log(`our server is running on localhost:${PORT}`);
});
