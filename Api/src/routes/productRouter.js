const { Router } = require("express");
const {
  getProductHandler,
  postProductHandler,
  putProductHandler,
} = require("../handlers/productHandler");
const verifyToken = require("../middleware/verifyToken");
const { requireAdmin } = require("../middleware/requireAdmin");

const productRouter = Router();

productRouter.get("/", getProductHandler);

productRouter.post("/", verifyToken, requireAdmin, postProductHandler);

productRouter.put("/edit/:id", verifyToken, requireAdmin, putProductHandler);

module.exports = productRouter;
