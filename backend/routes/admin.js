const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  getAllUsers,
  getAuditLogs,
  deleteUser,
} = require("../controllers/adminController");

router.get("/users", verifyToken, getAllUsers);
router.get("/audit-logs", verifyToken, getAuditLogs);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;
