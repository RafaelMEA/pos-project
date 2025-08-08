require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// authentication
const apiKeyAuth = require("./middlewares/apiKeyAuth");
const authRoutes = require("./routes/auth/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());


// authentication routes
app.use("/api", apiKeyAuth);
app.use("/api/auth", authRoutes);

// table routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const distPath = path.join(__dirname, "../backend/dist/");
app.use(express.static(distPath));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("API Key Authentication is enabled");
});
