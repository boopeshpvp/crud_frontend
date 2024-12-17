const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

route.post("/addUser", async (req, res) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.headers["refreshtoken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send({
      status: "fail",
      message: "Access denied, no token provided",
      data: {},
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = decoded;
    const user = await new User(req.body);
    return res.status(200).send({
      status: "success",
      message: "User Added Successfully",
      data: user.save(),
    });
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send({
        status: "Fail",
        message: "Access denied, no refresh Token provided",
        data: {},
      });
    }
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
    const user = await new User(req.body);
    return res.status(200).send({
      status: "success",
      message: "User Added Successfully",
      data: user.save(),
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(400).send({
      status: "Fail",
      message: "User session expired",
      data: {},
    });
  }
});

route.get("/getuserlist", async (req, res) => {
  try {
    const result = await User.find({});
    return res.status(200).send({
      data: result,
      message: "Recieved data successfully",
    });
  } catch (error) {
    console.log("geterror", error.message);
    return res.status(400).send({
      message: error.message,
      data: {},
    });
  }
});

route.delete("/deleteuser/:id", async (req, res) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.headers["refreshtoken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send({
      status: "fail",
      message: "Access denied, no token provided",
      data: {},
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = decoded;
    const deleteId = req.params.id;
    const result = await User.findByIdAndDelete(deleteId);
    res
      .status(200)
      .send({ data: result, message: "User deleted successfully" });
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send({
        status: "Fail",
        message: "Access denied, no refresh Token provided",
        data: {},
      });
    }
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
    const deleteId = req.params.id;
    const result = await User.findByIdAndDelete(deleteId);
    res.status(200).send({
      data: result,
      message: "User deleted successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(400).send({
      status: "Fail",
      message: "User session expired",
      data: {},
    });
  }
});

route.patch("/edituser/:id", async (req, res) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.headers["refreshtoken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send({
      status: "fail",
      message: "Access denied, no token provided",
      data: {},
    });
  }

  const updatedUser = req.body;
  const id = req.params.id;

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = decoded;
    const result = await User.findByIdAndUpdate(id, updatedUser, { new: true });
    return res.status(200).send({
      data: result,
      message: "User Edited Successfully",
    });
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send({
        status: "Fail",
        message: "Access denied, no refresh Token provided",
        data: {},
      });
    }
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
    const result = await User.findByIdAndUpdate(id, updatedUser, { new: true });
    return res.status(200).send({
      data: result,
      message: "User Edited Successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(400).send({
      status: "Fail",
      message: "User session expired",
      data: {},
    });
  }
});

module.exports = route;
