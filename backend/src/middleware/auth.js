const jwt = require("jsonwebtoken");

const { getAccountById } = require("../services/users");

require("dotenv").config();

const userAuthenticated = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await getAccountById(decoded.id);

      return next();
    } catch (error) {
      // Invalid token
      return res.status(401).json({
        statusCode: 401,
        msg: {
          eng: "You are not authorized! Invalid token...",
          esp: "No estás autorizado! Token inválido...",
        },
      });
    }
  } else {
    res.status(401).json({
      statusCode: 401,
      msg: {
        eng: "You are not authorized! Please login...",
        esp: "No estás autorizado! Inicie sesión...",
      },
    });
  }
};

module.exports = {
  userAuthenticated,
};
