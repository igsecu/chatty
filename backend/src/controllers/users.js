const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fsExtra = require("fs-extra");

const {
  validateUsername,
  validateState,
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
  updateUsername,
  updateState,
} = require("../services/users");

const { validateFileType, validateImageSize } = require("../utils/files.js");
const { uploadUserImage } = require("../utils/cloudinary");

require("dotenv").config();

// Logout process
const logout = async (req, res, next) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });

  res.status(200).json({
    statusCode: 200,
    msg: {
      eng: "User logged out successfully!",
      end: "Ha cerrado sesión satisfactoriamente!",
    },
  });
};

// Login process
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (req.cookies.jwt) {
    return res.status(400).json({
      statusCode: 400,
      msg: {
        eng: "A user is already logged in!",
        esp: "Un usuario ya ha iniciado sesión!",
      },
    });
  }

  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      msg: {
        eng: "Email is missing",
        esp: "Email es requerido",
      },
    });
  }

  if (!password) {
    return res.status(400).json({
      statusCode: 400,
      msg: {
        eng: "Password is missing",
        esp: "Password es requerido",
      },
    });
  }

  try {
    const emailExist = await checkEmailExist(email.toLowerCase());

    if (!emailExist) {
      return res.status(400).json({
        statusCode: 400,
        msg: {
          eng: "Invalid Email or Password!",
          esp: "La contraseña o el email ingresado es inválido!",
        },
      });
    }

    // Check password
    bcrypt.compare(password, emailExist.password, async (err, isMatch) => {
      if (err) {
        return next("Error during the login process!");
      }
      if (!isMatch) {
        return res.status(400).json({
          statusCode: 400,
          msg: {
            eng: "Invalid Email or Password!",
            esp: "La contraseña o el email ingresado es inválido!",
          },
        });
      } else {
        const userFound = await getAccountById(emailExist.id);

        generateToken(res, userFound.id);

        return res.status(200).json({
          statusCode: 200,
          msg: {
            eng: "Login successfully!",
            esp: "Ha iniciado sesión satisfactoriamente!",
          },
          data: userFound,
        });
      }
    });
  } catch (error) {
    return next("Error trying to authenticate user");
  }
};

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

// Update account
const updateAccount = async (req, res, next) => {
  const { username, state } = req.query;

  try {
    let accountUpdated;

    if (username) {
      if (validateUsername(username)) {
        return res.status(400).json({
          statusCode: 400,
          msg: validateUsername(username),
        });
      }

      accountUpdated = await updateUsername(req.user.id, username);
    }

    if (state) {
      if (validateState(state)) {
        return res.status(400).json({
          statusCode: 400,
          msg: validateState(state),
        });
      }

      accountUpdated = await updateState(req.user.id, state);
    }

    if (!username && !state) {
      return res.status(400).json({
        statusCode: 400,
        msg: {
          eng: "Username or state are missing!",
          esp: "Username o state requeridos!",
        },
      });
    }

    res.status(200).json({
      statusCode: 200,
      msg: {
        eng: "Account updated successfully!",
        esp: "Cuenta actualizada satisfactoriamente!",
      },
      data: accountUpdated,
    });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

// Update user image
const updateUserImage = async (req, res, next) => {
  try {
    if (req.files?.image) {
      if (await validateFileType(req.files.image.tempFilePath)) {
        const message = await validateFileType(req.files.image.tempFilePath);

        await fsExtra.unlink(req.files.image.tempFilePath);

        return res.status(400).json({
          statusCode: 400,
          msg: message,
        });
      }

      if (await validateImageSize(req.files.image.tempFilePath)) {
        const message = await validateImageSize(req.files.image.tempFilePath);

        await fsExtra.unlink(req.files.image.tempFilePath);

        return res.status(400).json({
          statusCode: 400,
          msg: message,
        });
      }

      const result = await uploadUserImage(req.files.image.tempFilePath);

      await fsExtra.unlink(req.files.image.tempFilePath);

      const userUpdated = await updateProfileImage(
        req.user.id,
        result.secure_url,
        result.public_id
      );

      return res.status(200).json({
        statusCode: 200,
        msg: {
          eng: "Your profile image was updated successfully!",
          esp: "Has actualizado tu imagen de perfil satisfactoriamente!",
        },
        data: userUpdated,
      });
    } else {
      return res.status(400).json({
        statusCode: 400,
        msg: { eng: "Image file is missing!", esp: "Imagen es requerida!" },
      });
    }
  } catch (error) {
    await fsExtra.unlink(req.files.image.tempFilePath);
    console.log(error.message);
    return next(error);
  }
};

// Delete profile image
const deleteUserImage = async (req, res, next) => {
  try {
    const account = await deleteProfileImage(req.user.id);

    if (account === null) {
      return res.status(400).json({
        statusCode: 400,
        msg: {
          eng: "You do not have a profile image to delete!",
          esp: "No tienes una imagen de perfil para eliminar!",
        },
      });
    }

    return res.status(200).json({
      statusCode: 200,
      msg: {
        eng: "Profile image deleted successfully!",
        esp: "Imagen de perfil eliminada satisfactoriamente!",
      },
      data: account,
    });
  } catch (error) {
    console.log(error.message);
    return next("Error trying to delete writer account profile image");
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
  login,
  logout,
  updateAccount,
  updateUserImage,
  deleteUserImage,
};
