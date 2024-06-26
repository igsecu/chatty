const express = require("express");
const router = express.Router();

const usersRouter = require("./users");

// Specify routers root routes
router.use("/users", usersRouter);

module.exports = router;
