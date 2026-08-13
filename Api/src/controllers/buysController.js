const axios = require("axios");
const { Buys } = require("../db");
const { Op } = require("sequelize");

// buy.products is stored as a single JSON string (see models/Buy.js);
// guard the parse so one malformed row can't 500 the whole list.
const safeParseProducts = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return { items: [], statusDetail: null };
  }
};

const getAllbuys = async function () {
  const allBuys = await Buys.findAll();
  return allBuys.map((buy) => ({
    ...buy.dataValues,
    products: safeParseProducts(buy.products),
  }));
};

const getAllBuysForUser = async function (userId) {
  try {
    const allBuys = await Buys.findAll({
      where: { userId },
    });
    return allBuys.map((buy) => ({
      ...buy.dataValues,
      products: safeParseProducts(buy.products),
    }));
  } catch (error) {
    console.error('Error al buscar las compras del usuario:', error);
    throw error;
  }
};

/* const postbuys = async (productId, userId, buyOut, totalAmount) => {
  const newBuy = await Buys.create({
    productId,
    userId,
    buyOut,
    totalAmount,
  });

  return newBuy;
}; */

module.exports = {
  getAllbuys,
  getAllBuysForUser
  /* postbuys, */
};