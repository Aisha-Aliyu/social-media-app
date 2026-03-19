const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const User = require("../models/User");

// @route  POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { content, images, visibility } = req.body;

    const post = await Post.create({
      author: req.user._id,
      content,
      images: images || [],
      visibility: visibility || "public",
    });

    await post.populate("author", "username displayName avatar isVerified");

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/posts/feed
// Returns public posts + posts from people user follows, paginated
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user._id).select("following");
    const followingIds = currentUser.following;

    // Feed = own posts + following posts + public posts
    const posts = await Post.find({
      $or: [
        { author: req.user._id },
        { author: { $in: followingIds } },
        { visibility: "public" },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username displayName avatar isVerified")
      .lean(); // lean() for faster reads. it returns plain JS objects

    const total = await Post.countDocuments({
      $or: [
        { author: req.user._id },
        { author: { $in: followingIds } },
        { visibility: "public" },
      ],
    });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/posts/:id/like
const toggleLike = async (req, res, next) => {
  try {
    const Notification = require("../models/Notification");
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
      // Notify post author (not self)
      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();
    res.status(200).json({
      success: true,
      liked: !isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    // Only the author can delete
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    await post.deleteOne();
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/posts/:id/comment
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0)
      return res.status(400).json({ success: false, message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();
    await post.populate("comments.user", "username displayName avatar");

    res.status(201).json({
      success: true,
      comment: post.comments[post.comments.length - 1],
      commentsCount: post.comments.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getFeed, toggleLike, deletePost, addComment };
