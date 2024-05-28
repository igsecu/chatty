const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fsExtra = require("fs-extra");

const {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateId,
  validatePage,
} = require("../utils/index.js");

const {
  checkEmailExist,
  createNewAccount,
  getAccountById,
  updateProfileImage,
  deleteProfileImage,
  deleteAccount,
} = require("../services/users");

const { validateFileType, validateImageSize } = require("../utils/files.js");
const { uploadUserImage } = require("../utils/cloudinary");

require("dotenv").config();

// Create account
const createAccount = async (req, res, next) => {
  const { email, password, password2 } = req.body;

  if (validateEmail(email)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validateEmail(email),
    });
  }

  if (validatePassword(password)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validatePassword(password),
    });
  }

  if (validatePasswordConfirmation(password, password2)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validatePasswordConfirmation(password, password2),
    });
  }

  try {
    const emailExist = await checkEmailExist(email.toLowerCase());

    if (emailExist) {
      return res.status(400).json({
        statusCode: 400,
        msg: {
          eng: `Email "${email}" exists! Try with another one!`,
          esp: `Email "${email}" ya existe! Prueba con otro!`,
        },
      });
    }

    // Hash Password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return next("Error trying to create a new account");
        }
        try {
          const accountCreated = await createNewAccount(hash, email);

          if (accountCreated) {
            const account = await getAccountById(accountCreated.id);

            generateToken(res, account.id);

            return res.status(201).json({
              statusCode: 201,
              data: account,
              msg: {
                eng: "Account created successfully!",
                esp: "Cuenta creada satisfactoriamente!",
              },
            });
          }
        } catch (error) {
          console.log(error.message);
          return next("Error trying to create a new account");
        }
      });
    });
  } catch (error) {
    return next(error);
  }
};

// Generate JWT
const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  createAccount,
};
