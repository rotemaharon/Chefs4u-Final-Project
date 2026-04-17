const Message = require("../models/Message");
const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = Joi.object({
  recipientId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ "string.pattern.base": "מזהה נמען לא תקין" }),
  content: Joi.string().min(1).max(2000).required(),
});

exports.sendMessage = async (req, res) => {
  try {
    const { error } = messageSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `שגיאת ולידציה: ${error.details[0].message}` });
    }

    const { recipientId, content } = req.body;
    const newMessage = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      hiddenBy: [],
    });

    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בשליחת ההודעה" });
  }
};

exports.getChat = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id },
      ],
      hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) },
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בשליפת ההודעות" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.user.id);

    const messages = await Message.find({
      $or: [{ sender: myId }, { recipient: myId }],
      hiddenBy: { $ne: myId },
    })
      .sort({ createdAt: 1 })
      .populate("sender recipient", "fullName role");

    const conversations = {};

    messages.forEach((msg) => {
      if (!msg.sender || !msg.recipient) return;

      const isSenderMe = msg.sender._id.toString() === req.user.id.toString();
      const otherUser = isSenderMe ? msg.recipient : msg.sender;
      const otherUserId = otherUser._id.toString();

      conversations[otherUserId] = {
        userId: otherUserId,
        fullName: otherUser.fullName,
        role: otherUser.role,
        lastMessage: msg.content,
        date: msg.createdAt,
      };
    });

    const result = Object.values(conversations).sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בטעינת השיחות" });
  }
};
exports.hideConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "מזהה משתמש לא תקין" });
    }

    const myId = new mongoose.Types.ObjectId(req.user.id);
    const otherId = new mongoose.Types.ObjectId(userId);

    await Message.updateMany(
      {
        $or: [
          { sender: myId, recipient: otherId },
          { sender: otherId, recipient: myId },
        ],
      },
      { $addToSet: { hiddenBy: myId } },
    );
    res.json({ message: "השיחה הוסתרה" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בהסתרת השיחה" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false,
      hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) },
    });
    res.json({ unreadCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בספירת הודעות" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Message.updateMany(
      { sender: userId, recipient: req.user.id, isRead: false },
      { $set: { isRead: true } },
    );

    const newCount = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false,
      hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) },
    });

    res.json({ unreadCount: newCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בעדכון סטטוס קריאה" });
  }
};