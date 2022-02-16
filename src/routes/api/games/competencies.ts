import express, { 
    Request, 
    Response,
    NextFunction 
} from "express";
import { param, body } from "express-validator";
import { asyncMiddleware } from "middleware-async";

import CompetenceDTO from "../../../domain/dto/competence-dto";
import sendResponse from "../../../utils/send-response";
import validateRequest from "../../../validators/validate-request";
import verifyToken from "../../../validators/verify-token";
import { Competence, CompetenceDocument } from "../../../domain/models/competence";
import { Game, GameDocument } from "../../../domain/models/game";
import { LogicError, AccessError } from "../../../utils/errors";
import { Role } from "../../../domain/models/user";

const gameCompetenciesRouter = express.Router();

gameCompetenciesRouter.use("/:competenceId", 
    validateRequest(
        param("competenceId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        if (!await Competence.exists({ id: req.data.competenceId })) {
            next(new LogicError(
                req.originalUrl, 
                "Компетенции с указанным id не существует."
            ));
        }
        else
            next();
    })
);

gameCompetenciesRouter.get("/", 
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ id: req.data.gameId });

        const competencies: Array<CompetenceDocument> = await game.getCompetencies();

        sendResponse(
            res,
            await Promise.all(
                competencies.map(c => CompetenceDTO.create(c))
            )
        );
    }
));

gameCompetenciesRouter.put("/", 
    verifyToken,
    validateRequest(
        body("id")
            .isArray(),
        body("id.*")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.data.gameId 
        });

        if (game.author !== req.user.id && req.user.role !== Role.Admin)
            return next(new AccessError(req.originalUrl));

        const competencies: Array<CompetenceDocument> = await Competence.find({ 
            id: { $in: req.data.id }
        });

        if (competencies.length !== req.data.id.length) {
            return next(new LogicError(
                req.originalUrl,
                "Одна или несколько компетенций не найдены."
            ));
        }

        await game.addCompetencies(competencies);

        await game.save();

        sendResponse(
            res, 
            await Promise.all(
                competencies.map(c => CompetenceDTO.create(c))
            )
        );
    })
);

gameCompetenciesRouter.delete("/", 
    verifyToken,
    validateRequest(
        body("id")
            .isArray(),
        body("id.*")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const game: GameDocument = await Game.findOne({ 
            id: req.data.gameId 
        });

        if (game.author !== req.user.id && req.user.role !== Role.Admin)
            return next(new AccessError(req.originalUrl));

        const competencies: Array<CompetenceDocument> = await Competence.find({ 
            id: { $in: req.data.id }
        });

        if (competencies.length !== req.data.id) {
            return next(new LogicError(
                req.originalUrl,
                "Одна или несколько компетенций не найдены."
            ));
        }

        await Promise.all(
            competencies.map(c => game.removeCompetence(c))
        );

        await game.save();

        sendResponse(
            res,
            await Promise.all(
                competencies.map(c => CompetenceDTO.create(c))
            )
        );
    })
);

export default gameCompetenciesRouter;
