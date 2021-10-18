import express from "express";

import * as commentsController from "../../controllers/api/comments";
import * as commentsValidator from "../../validators/api/comments";
import validateToken from "../../validators/validateToken";

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
commentsRouter.get("/:id", 
    commentsValidator.getComment, 
    commentsController.getComment
);
commentsRouter.put("/:id", 
    validateToken,
    commentsValidator.updateComment, 
    commentsController.updateComment
);
commentsRouter.delete("/:id", 
    validateToken,
    commentsValidator.deleteComment,
    commentsController.deleteComment
);

export default commentsRouter;
