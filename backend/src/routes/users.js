const express = require("express");
const router = express.Router();

const { userAuthenticated } = require("../middleware/auth");

const fileUpload = require("express-fileupload");

const { createAccount, login } = require("../controllers/users");

// Login process
router.post("/login", login);
// Create account
router.post("/register", createAccount);

module.exports = router;
