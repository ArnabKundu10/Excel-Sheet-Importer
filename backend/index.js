const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const candidateRoutes = require("./routes/candidateRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const DB = `mongodb+srv://Arnab:${password}@atlascluster.esd35xx.mongodb.net/excelupload?retryWrites=true&w=majority`;
const DBconnect = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB Connected:", ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
DBconnect();
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/candidates", candidateRoutes);

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
