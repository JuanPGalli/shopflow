const { Router } = require('express');
const { postUserHandler, getUserHandler, putUserHandler, getUserEmailHandler } = require("../handlers/userHandler");
const verifyToken = require("../middleware/verifyToken");
const { requireAdmin } = require("../middleware/requireAdmin");

const userRouter = Router();

userRouter.get("/", getUserHandler);
userRouter.get("/email", getUserEmailHandler);
userRouter.post("/create", postUserHandler);
// Banning/unbanning users and granting admin rights is destructive —
// only an authenticated admin/superadmin may call this.
userRouter.put("/update/:id", verifyToken, requireAdmin, putUserHandler);

module.exports = userRouter;