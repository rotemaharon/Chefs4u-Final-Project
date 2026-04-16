const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, messageController.sendMessage);
router.get("/conversations", auth, messageController.getConversations);
router.get("/unread-count", auth, messageController.getUnreadCount);
router.patch("/mark-as-read/:userId", auth, messageController.markAsRead);
router.delete(
  "/conversations/:userId",
  auth,
  messageController.hideConversation,
);
router.get("/:userId", auth, messageController.getChat);

module.exports = router;
