const express = require("express");
const router = express.Router();

const { userAuthenticated } = require("../middleware/auth");

const fileUpload = require("express-fileupload");

const { createAccount, login, logout } = require("../controllers/users");

// Logout process
router.post("/logout", userAuthenticated, logout);
// Login process
router.post("/login", login);
// Create account
router.post("/register", createAccount);

module.exports = router;
