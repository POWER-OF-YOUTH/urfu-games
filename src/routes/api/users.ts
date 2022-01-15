import express from "express";

import * as usersController from "../../controllers/api/users";
import * as usersValidator from "../../validators/api/users";

import validateToken from "../../validators/validateToken";

const usersRouter = express.Router();

usersRouter.get("/", usersValidator.getUsers, usersController.getUsers);

usersRouter.get("/:id", usersValidator.getUser, usersController.getUser);

usersRouter.put("/:id", 
    validateToken, 
    usersValidator.updateUser, 
    usersController.updateUser
);

export default usersRouter;
