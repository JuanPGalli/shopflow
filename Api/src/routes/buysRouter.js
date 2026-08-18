const { Router } = require("express");
const { getbuysHandler, getBuysForUserHandler } = require("../handlers/buysHandler");
const verifyToken = require("../middleware/verifyToken");
const { requireAdmin } = require("../middleware/requireAdmin");
const requireSelfOrAdmin = require("../middleware/requireSelfOrAdmin");

const buysRouter = Router();

// Every user's purchase history at once — admin only.
buysRouter.get("/", verifyToken, requireAdmin, getbuysHandler);

// A single user's purchase history — that user themself, or an admin.
buysRouter.get("/user/:email", verifyToken, requireSelfOrAdmin, getBuysForUserHandler);
// buysRouter.post("/", postbuysHandler);

module.exports = buysRouter;
