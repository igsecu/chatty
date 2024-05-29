const express = require("express");
const router = express.Router();

const { userAuthenticated } = require("../middleware/auth");

const fileUpload = require("express-fileupload");

const {
  createAccount,
  login,
  logout,
  updateAccount,
  updateUserImage,
  deleteUserImage,
  deleteUserAccount,
} = require("../controllers/users");

// Logout process
router.post("/logout", userAuthenticated, logout);
// Login process
router.post("/login", login);
// Create account
router.post("/register", createAccount);
// Update account
router.put("/account", userAuthenticated, updateAccount);
// Update user image
router.put(
  "/image",
  fileUpload({
    useTempFiles: true,
    tempFileDir: `${__dirname}/../uploads`,
  }),
  userAuthenticated,
  updateUserImage
);
// Delete user image
router.delete("/image", userAuthenticated, deleteUserImage);
// Delete user account
router.delete("/account", userAuthenticated, deleteUserAccount);

module.exports = router;
