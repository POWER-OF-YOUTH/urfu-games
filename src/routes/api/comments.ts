import express from "express";

import * as commentsController from "../../controllers/api/comments";
import * as commentsValidator from "../../validators/api/comments";
import validateToken from "../../validators/validateToken";

const commentsRouter = express.Router();

commentsRouter.post("/comments", commentsValidator.addComment, commentsController.addComment);

export default commentsRouter;
