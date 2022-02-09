import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { body, query } from "express-validator";
import { asyncMiddleware } from "middleware-async";

import sendResponse from "../../../utils/send-response";
import { Game, GameDocument } from "../../../domain/models/game";
import { User, UserDocument } from "../../../domain/models/user";
import { Rating, RatingDocument } from "../../../domain/models/rating";
import RatingDetailDTO from "../../../domain/dto/rating-detail-dto";
import validateRequest from "../../../validators/validate-request";
import verifyToken from "../../../validators/verify-token";
import { LogicError } from "../../../utils/errors";

const ratingsRouter = express.Router();

ratingsRouter.put("/",
    verifyToken,
    validateRequest(
        body("value")
            .isNumeric() // TODO: Range check
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const author: UserDocument = await User.findOne({ 
            id: req.user.id 
        });

        const game: GameDocument = await Game.findOne({ 
            id: req.data.gameId 
        });

        const rating: RatingDocument = await game.rate(req.data.value, author);

        await game.save();

        sendResponse(
            res,
            await RatingDetailDTO.create(rating)
        );
    })
);

ratingsRouter.get("/", 
    validateRequest(
        query("start")
            .default(0)
            .isInt({ gt: -1 })
            .toInt(),
        query("count")
            .default(10)
            .isInt({ gt: 0, lt: 100 })
            .toInt()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.data.gameId 
        });

        const ratings: Array<RatingDocument> = await game.getRatings(
            req.data.start, 
            req.data.count
        );

        sendResponse(
            res,
            await Promise.all(
                ratings.map(r => RatingDetailDTO.create(r))
            )
        );
    })
);

ratingsRouter.delete("/",
    verifyToken,
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const author: UserDocument = await User.findOne({ 
            id: req.user.id 
        });

        const game: GameDocument = await Game.findOne({ 
            id: req.data.gameId 
        });

        const rating: RatingDocument = await game.getRating(author);

        if (rating === null) {
            next(new LogicError(
                req.originalUrl,
                "Пользователь не оценивал игру."
            ));
        }

        await game.deleteRate(author);

        await game.save();

        sendResponse(
            res,
            await RatingDetailDTO.create(rating)
        );
    })
);

export default ratingsRouter;
