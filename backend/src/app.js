const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/filerouters");
const app = express();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
