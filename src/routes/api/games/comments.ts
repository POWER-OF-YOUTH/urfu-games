import express from "express";

import * as commentsController from "../../../controllers/api/games/comments";
import * as commentsValidator from "../../../validators/api/games/comments";
import validateToken from "../../../validators/validateToken";

const commentsRouter = express.Router();

commentsRouter.post("/", 
    validateToken, 
    commentsValidator.addComment, 
    commentsController.addComment
);
commentsRouter.get("/", 
    commentsValidator.getComments, 
    commentsController.getComments
);
commentsRouter.get("/:commentId", 
    commentsValidator.getComment, 
    commentsController.getComment
);
commentsRouter.put("/:commentId", 
    validateToken,
    commentsValidator.updateComment, 
    commentsController.updateComment
);
commentsRouter.delete("/:commentId", 
    validateToken,
    commentsValidator.deleteComment,
    commentsController.deleteComment
);

export default commentsRouter;
