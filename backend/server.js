require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiKeyAuth = require("./middlewares/apiKeyAuth");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api", apiKeyAuth);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

const distPath = path.join(__dirname, "../backend/dist/");
app.use(express.static(distPath));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("API Key Authentication is enabled");
});
