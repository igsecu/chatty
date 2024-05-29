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

// Update Username
const updateUsername = async (id, username) => {
  try {
    const updatedAccount = await User.update(
      {
        username,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedAccount[0] === 1) {
      const account = await getAccountById(id);

      return account;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to update account username!");
  }
};

// Update State
const updateState = async (id, state) => {
  try {
    const updatedAccount = await User.update(
      {
        state,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedAccount[0] === 1) {
      const account = await getAccountById(id);

      return account;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to update account state!");
  }
};

// Update profile image
const updateProfileImage = async (id, image, image_id) => {
  try {
    const account = await User.findByPk(id);

    if (account.image_id !== null) {
      await deleteImage(account.image_id);
    }

    const updatedAccount = await User.update(
      {
        image,
        image_id,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedAccount[0] === 1) {
      const account = await getAccountById(id);

      return account;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to update the writer account profile image!");
  }
};

// Delete profile image
const deleteProfileImage = async (id) => {
  try {
    const account = await User.findByPk(id);

    if (account.image_id === null) {
      return null;
    }

    await deleteImage(account.image_id);

    const updatedAccount = await User.update(
      {
        image: null,
        image_id: null,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedAccount[0] === 1) {
      const account = await getAccountById(id);

      return account;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to delete user profile image");
  }
};

// Delete account
const deleteAccount = async (id) => {
  try {
    const account = await User.findByPk(id);

    if (account.image_id !== null) {
      await deleteImage(account.image_id);
    }

    const deletedAccount = await User.destroy({
      where: {
        id,
      },
    });

    if (deletedAccount) {
      return deletedAccount;
    }
  } catch (error) {
    throw new Error("Error trying to delete an account");
  }
};

module.exports = {
  checkEmailExist,
  createNewAccount,
  getAccountById,
  updateUsername,
  updateState,
  updateProfileImage,
  deleteProfileImage,
  deleteAccount,
};
