const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const candidateRoutes = require("./routes/candidateRoutes");

const app = express();
const PORT = 5000;

// MongoDB Connection
const password = encodeURIComponent("Arnab12@");
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
// Middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/candidates", candidateRoutes);

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
