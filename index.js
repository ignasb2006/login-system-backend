const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB prisijungė");
    app.listen(process.env.PORT, () => {
      console.log(`Serveris veikia ant ${process.env.PORT} porto`);
    });
  })
  .catch(err => console.log(err));
