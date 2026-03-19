const express = require("express");
const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadMessagesCount,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// Order matters, specific routes before dynamic
router.get("/conversations", getConversations);
router.get("/unread-count", getUnreadMessagesCount);
router.get("/:userId", getMessages);
router.post("/:userId", sendMessage);

module.exports = router;
