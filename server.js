// src/app.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const orderRoutes = require("./src/routes/orderRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");

const app = express();
const port = 3000;

app.use(express.json());

const dbHost = "localhost";
const dbPort = 27017;
const dbName = "ordermanagement";
const dbUser = "root";
const dbPassword = "rootpassword";

const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

mongoose.set("strictQuery", false);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(connectionString, mongooseOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use("/orders", orderRoutes);
app.use("/services", serviceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
