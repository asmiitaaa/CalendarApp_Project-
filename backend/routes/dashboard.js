const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/dashboardController");

router.get("/stats", verifyToken, getDashboardStats);

module.exports = router;
