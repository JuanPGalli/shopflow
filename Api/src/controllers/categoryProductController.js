const axios = require("axios");
const { CategoryProduct } = require("../db");
const { Op } = require("sequelize");
const productCategory = require("../../dataApi/productCategory");


const getAllCategoryProduct = async function () {
    // Only seed once: if categories already exist, skip straight to findAll.
    const existing = await CategoryProduct.findAll();
    if (existing.length === 0) {
      // Wait for every findOrCreate to actually finish before reading
      // back the table, otherwise the first request after a fresh
      // deploy can read an empty/partial table (race condition).
      await Promise.all(
        productCategory.map((nameCategory) =>
          CategoryProduct.findOrCreate({ where: { name: nameCategory } }),
        ),
      );
    }

    return CategoryProduct.findAll();
    };

  module.exports = {
    getAllCategoryProduct
  };