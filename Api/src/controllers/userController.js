const { User } = require("../db");
const { Op } = require("sequelize");
//const Product = require("../models/Product");

const getAllUser = async function () {
  return User.findAll();
};

const getUserByName = async function (name) {
  if (name) {
    const rawArrayDB = await User.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });

    if (rawArrayDB.length > 0) return rawArrayDB;
    else throw new Error("User name not found");
  }
};

const postUser = async (
  name,
  email,
  image,
  userState,
  userAdmin,
  userSuperadmin,
) => {
  const [newUser] = await User.findOrCreate({
    where: { email },
    defaults: {
      name,
      image,
      userState,
      userAdmin,
      userSuperadmin,
    },
  });
  return newUser;
};

const updateUser = async (id, userState, userAdmin, userSuperadmin) => {
  const user = await User.findOne({ where: { id } });
  if (user) {
    await user.update({
      userState,
      userAdmin,
      userSuperadmin,
    });
  }
  return user;
};

const getUserByEmail = async function (email) {
  if (email) {
    return User.findAll({
      where: {
        email: {
          [Op.iLike]: `%${email}%`,
        },
      },
    });
  }
};

module.exports = {
  postUser,
  getAllUser,
  getUserByName,
  updateUser,
  getUserByEmail
};