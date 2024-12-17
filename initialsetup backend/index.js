const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/initial_setup", { family: 4 })
  .then(() => {
    console.log("The database is connected");
  })
  .catch((error) => {
    console.log("error", error);
  });

app.use("/auth", authRoute);
app.use("/user", userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is started");
});
