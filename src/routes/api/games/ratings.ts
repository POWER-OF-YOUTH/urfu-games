import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { body } from "express-validator";
import { asyncMiddleware } from "middleware-async";
import { HydratedDocument } from "mongoose";
import { v4 as uuid } from "uuid";

import { User, IUser } from "../../../models/user";
import { IGamePopulated } from "../../../models/game";
import { Rating, IRatingPopulated } from "../../../models/rating";
import { RatingDTO } from "../../../utils/dto";
import requestValidator from "../../../validators/request_validator";
import validateToken from "../../../validators/validateToken";
import { LogicError } from "../../../utils/errors";

const ratingsRouter = express.Router();

ratingsRouter.get("/", 
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;

        const ratingsDocuments: Array<HydratedDocument<IRatingPopulated>> = 
            await Rating.find({ gameId: gameDocument.id });

        res.json(ratingsDocuments.map(rd => new RatingDTO(rd)));
    })
);

ratingsRouter.put("/",
    validateToken,
    body("value").isNumeric(), // TODO: Range check
    requestValidator,
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const user: any = req.user;
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;
        const userDocument: HydratedDocument<IUser> = await User.findOne({ id: user.id });
        let ratingDocument: HydratedDocument<IRatingPopulated> = 
            await Rating.findOne({ gameId: gameDocument.id, author: userDocument._id });

        if (ratingDocument !== null) {
            ratingDocument.value = req.body.value; // TODO 

            await ratingDocument.save();
        }
        else {
            ratingDocument = await Rating.create({  
                id: uuid(),
                gameId: gameDocument.id,
                author: userDocument._id,
                value: req.body.value, // TODO
                createdAt: Date.now()
            });

            await ratingDocument.populate("author");
        }

        res.json(new RatingDTO(ratingDocument));

        const ratingsDocuments: Array<HydratedDocument<IRatingPopulated>> = 
            await Rating.find({ gameId: gameDocument.id });

        let averageGameRating = 0;
        for (const rd of ratingsDocuments) 
            averageGameRating += rd.value / ratingsDocuments.length;

        gameDocument.rating = averageGameRating;

        await gameDocument.save();
    })
);

ratingsRouter.delete("/",
    validateToken,
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const user: any = req.user;
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;
        const userDocument: HydratedDocument<IUser> = await User.findOne({ id: user.id });
        const ratingDocument: HydratedDocument<IRatingPopulated> = 
            await Rating.findOne({ gameId: gameDocument.id, author: userDocument._id });

        if (ratingDocument === null)
            next(new LogicError(req.originalUrl, "Вы не выставляли оценок данной игре."));
        else {
            res.locals.ratingDocument = ratingDocument;

            next();
        }
    }),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;
        const ratingDocument: HydratedDocument<IRatingPopulated> = res.locals.ratingDocument;

        res.json(new RatingDTO(ratingDocument));

        await ratingDocument.delete();

        const ratingsDocuments: Array<HydratedDocument<IRatingPopulated>> = 
            await Rating.find({ gameId: gameDocument.id });

        let averageGameRating = 0;
        for (const rd of ratingsDocuments) 
            averageGameRating += rd.value / ratingsDocuments.length;

        gameDocument.rating = averageGameRating;

        await gameDocument.save();
    })
);

export default ratingsRouter;
