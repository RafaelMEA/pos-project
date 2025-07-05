require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiKeyAuth = require("./middlewares/apiKeyAuth");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Apply API key authentication to all routes
app.use(apiKeyAuth);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("API Key Authentication is enabled");
});
