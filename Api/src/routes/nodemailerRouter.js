const { Router } = require("express");
const {
  postNodemailerHandler,
  postMailingHandler,
} = require("../handlers/nodemailerHandler");
const verifyToken = require("../middleware/verifyToken");
const { requireAdmin } = require("../middleware/requireAdmin");

const nodemailerRouter = Router();

// Registration confirmation email — triggered as part of normal
// signup, stays public.
nodemailerRouter.post("/", postNodemailerHandler);

// Mass email blast to the user list — admin only.
nodemailerRouter.post("/mailing", verifyToken, requireAdmin, postMailingHandler);

module.exports = nodemailerRouter;
