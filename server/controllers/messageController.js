const Message = require("../models/Message");
const User = require("../models/User");

// @route GET /api/messages/conversations
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all unique conversations for this user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    // Populate user info for each conversation
    const conversations = await Promise.all(
      messages.map(async (convo) => {
        const msg = convo.lastMessage;
        const otherUserId =
          msg.sender.toString() === userId.toString()
            ? msg.recipient
            : msg.sender;

        const otherUser = await User.findById(otherUserId)
          .select("username displayName avatar isVerified")
          .lean();

        const unreadCount = await Message.countDocuments({
          conversationId: convo._id,
          recipient: userId,
          read: false,
        });

        return {
          conversationId: convo._id,
          user: otherUser,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unread: unreadCount,
        };
      })
    );

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/messages/:userId
const getMessages = async (req, res, next) => {
  try {
    const conversationId = Message.getConversationId(
      req.user._id,
      req.params.userId
    );

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "username displayName avatar")
      .populate("recipient", "username displayName avatar")
      .lean();

    // Mark messages as read
    await Message.updateMany(
      { conversationId, recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/messages/:userId
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ success: false, message: "Message text required" });

    if (req.params.userId === req.user._id.toString())
      return res.status(400).json({ success: false, message: "Cannot message yourself" });

    const recipient = await User.findById(req.params.userId);
    if (!recipient)
      return res.status(404).json({ success: false, message: "User not found" });

    const conversationId = Message.getConversationId(
      req.user._id,
      req.params.userId
    );

    const message = await Message.create({
      sender: req.user._id,
      recipient: req.params.userId,
      text: text.trim(),
      conversationId,
    });

    await message.populate("sender", "username displayName avatar");
    await message.populate("recipient", "username displayName avatar");

    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/messages/unread-count
const getUnreadMessagesCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false,
    });
    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getMessages, sendMessage, getUnreadMessagesCount };
