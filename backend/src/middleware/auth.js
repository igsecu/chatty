const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { getAccountById } = require("../services/users");

require("dotenv").config();

const userAuthenticated = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await getAccountById(decoded.id);

      return next();
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        msg: {
          eng: "You are not authorized! Please login...",
          esp: "No estás autorizado! Inicie sesión...",
        },
      });
    }
  }
  res.status(401).json({
    statusCode: 401,
    msg: {
      eng: "You are not authorized! Please login...",
      esp: "No estás autorizado! Inicie sesión...",
    },
  });
};

module.exports = {
  userAuthenticated,
};
