const User = require("../models/User");

const { deleteImage } = require("../utils/cloudinary");

// Check if email exists
const checkEmailExist = async (email) => {
  try {
    const emailFound = await User.findOne({
      where: {
        email,
      },
    });

    return emailFound;
  } catch (error) {
    throw new Error("Error trying to check if email exists");
  }
};

// Create account
const createNewAccount = async (hash, email) => {
  try {
    const accountCreated = await User.create({
      password: hash,
      email: email.toLowerCase(),
    });

    return accountCreated;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to create new account");
  }
};

// Get account by id
const getAccountById = async (id) => {
  try {
    const account = await User.findByPk(id, {
      attributes: ["id", "email", "username", "state", "image"],
    });

    if (account) {
      return {
        id: account.id,
        email: account.email,
        image: account.image,
        username: account.username,
        state: account.state,
      };
    }

    return account;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to get an account by its id");
  }
};

module.exports = {
  checkEmailExist,
  createNewAccount,
  getAccountById,
};
