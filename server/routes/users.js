const express = require("express");
const {
  getUserProfile,
  toggleFollow,
  updateProfile,
  searchUsers,
  getSuggestions,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// Static routes MUST be before /:username
router.get("/search", searchUsers);
router.get("/suggestions", getSuggestions);
router.put("/profile/update", updateProfile);

// Dynamic routes after
router.get("/:username", getUserProfile);
router.put("/:id/follow", toggleFollow);

module.exports = router;
