const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

// @route GET /api/users/:username
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .lean();

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username displayName avatar isVerified")
      .lean();

    res.status(200).json({
      success: true,
      user: {
        ...user,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: posts.length,
      },
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/:id/follow
const toggleFollow = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: "You can't follow yourself" });

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser)
      return res.status(404).json({ success: false, message: "User not found" });

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(req.params.id);
      targetUser.followers.pull(req.user._id);
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      targetUser.followers.push(req.user._id);

      // Create notification
      await Notification.create({
        recipient: targetUser._id,
        sender: req.user._id,
        type: "follow",
      });
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      success: true,
      following: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/profile/update
const updateProfile = async (req, res, next) => {
  try {
    const { displayName, bio, avatar, coverPhoto } = req.body;

    const allowedUpdates = {};
    if (displayName !== undefined) allowedUpdates.displayName = displayName;
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (avatar !== undefined) allowedUpdates.avatar = avatar;
    if (coverPhoto !== undefined) allowedUpdates.coverPhoto = coverPhoto;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/users/search?q=query
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1)
      return res.status(400).json({ success: false, message: "Search query required" });

    const users = await User.find({
      $or: [
        { username: { $regex: q.trim(), $options: "i" } },
        { displayName: { $regex: q.trim(), $options: "i" } },
      ],
      _id: { $ne: req.user._id }, // exclude self
    })
      .select("username displayName avatar isVerified followers")
      .limit(20)
      .lean();

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/users/suggestions
const getSuggestions = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id).select("following");
    const users = await User.find({
      _id: { $ne: req.user._id, $nin: currentUser.following },
    })
      .select("username displayName avatar isVerified followers")
      .limit(6)
      .lean();

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  toggleFollow,
  updateProfile,
  searchUsers,
  getSuggestions,
};
