const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/", authController.registerDetails);
router.post("/login", authController.loginDetails);

module.exports = router;
