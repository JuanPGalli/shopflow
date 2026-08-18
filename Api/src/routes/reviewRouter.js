const { Router } = require("express");
const {
  getreviewHandler,
  postreviewHandler,
  putreviewHandler,
  userreviewHandler,
} = require("../handlers/reviewHandler");
const verifyToken = require("../middleware/verifyToken");

const reviewRouter = Router();

reviewRouter.get("/", getreviewHandler);
reviewRouter.get("/users/:userId/reviews", userreviewHandler);

// Who's posting/editing a review must come from their verified token,
// not a client-supplied email — otherwise anyone can review as anyone.
reviewRouter.post("/create", verifyToken, postreviewHandler);

reviewRouter.put("/update/:id", verifyToken, putreviewHandler);

module.exports = reviewRouter;
