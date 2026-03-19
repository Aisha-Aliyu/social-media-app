const express = require("express");
const { body } = require("express-validator");
const {
  createPost,
  getFeed,
  toggleLike,
  deletePost,
  addComment,
} = require("../controllers/postController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All post routes require authentication
router.use(protect);

router.get("/feed", getFeed);

router.post(
  "/",
  [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ max: 500 })
      .withMessage("Max 500 characters"),
  ],
  createPost
);

router.put("/:id/like", toggleLike);
router.delete("/:id", deletePost);
router.post("/:id/comment", addComment);

// Delete a comment
router.delete("/:postId/comment/:commentId", async (req, res, next) => {
  try {
    const Post = require("../models/Post");

    const post = await Post.findById(req.params.postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    // Only the comment author can delete it
    if (comment.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
