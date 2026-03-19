const Notification = require("../models/Notification");

// @route GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("sender", "username displayName avatar isVerified")
      .populate("post", "content")
      .lean();

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/notifications/read-all
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/notifications/unread-count
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });
    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAllRead, getUnreadCount };
