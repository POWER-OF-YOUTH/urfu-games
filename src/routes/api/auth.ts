import express from "express";

import authValidator from "../../validators/api/auth";
import authController from "../../controllers/api/auth";

const authRouter = express.Router();

authRouter.post("/signup", authValidator.signUp, authController.signUp);
authRouter.post("/signin", authValidator.signIn, authController.signIn);
authRouter.post("/signout", authController.signOut);

export default authRouter;