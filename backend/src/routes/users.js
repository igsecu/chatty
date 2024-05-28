const express = require("express");
const router = express.Router();

const { userAuthenticated } = require("../middleware/auth");

const fileUpload = require("express-fileupload");

const { createAccount } = require("../controllers/users");

// Create account
router.post("/register", createAccount);

module.exports = router;
