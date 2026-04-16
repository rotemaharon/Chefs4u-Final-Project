const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", auth, authController.getProfile);
router.put("/profile", auth, authController.updateProfile);
router.post(
  "/profile/image",
  auth,
  upload.single("profileImage"),
  authController.uploadProfileImage,
);

router.post("/favorites/:jobId", auth, authController.toggleFavorite);
router.get("/favorites", auth, authController.getFavorites);

router.get("/users", auth, admin, authController.getAllUsers);
router.put("/users/:id/role", auth, admin, authController.updateUserRole);
router.delete("/users/:id", auth, admin, authController.deleteUser);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
