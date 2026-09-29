import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db";
import { authenticate } from "./middleware/auth.middleware";
import { requireAdmin } from "./middleware/admin.middleware";
import authRoute from "./routes/auth.routes";
import productsRoute from "./routes/product.route";
import cartRoute from './routes/cart.routes';
import { errorMiddleware } from "./middleware/error.middleware";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/test/protected", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

app.get("/api/test/admin", authenticate, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You have admin access",
    user: req.user,
  });
});

app.use("/api/products", productsRoute);
app.use("/api/cart",cartRoute);
app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
};
startServer();
