const express = require("express");
const {
  getNotifications,
  markAllRead,
  getUnreadCount,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read-all", markAllRead);

module.exports = router;
