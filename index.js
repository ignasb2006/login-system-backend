const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Mongo prisijungimas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB prisijungė");
    app.listen(process.env.PORT, () => {
      console.log(`Serveris veikia ant ${process.env.PORT} porto`);
    });
  })
  .catch(err => console.log(err));
