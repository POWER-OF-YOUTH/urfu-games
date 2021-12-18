import express, { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { param, body } from "express-validator";
import { asyncMiddleware } from "middleware-async";

import validateToken from "../../../validators/validateToken";
import { CompetenceDTO } from "../../../utils/dto";
import { LogicError, AccessError } from "../../../utils/errors";
import { Role } from "../../../models/user";
import { IGamePopulated } from "../../../models/game";
import { Competence,  ICompetence } from "../../../models/competence";
import requestValidator from "../../../validators/request_validator";

const gameCompetenciesRouter = express.Router();

/// Requests handling
/*
    1. validation errors handler
    ↓
    2. logic errors handler
    ↓
    3. access handler
    ↓
    4. business logic and response
*/

gameCompetenciesRouter.use("/:competenceId", 
    param("competenceId")
        .isUUID(),
    requestValidator
);

gameCompetenciesRouter.use("/:competenceId", 
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;
        const competenceDocument: HydratedDocument<ICompetence> 
            = await Competence.findOne({ id: req.params.competenceId }); 

        if (competenceDocument === null)
            next(new LogicError(req.originalUrl, "Компетенции с указанным id не существует."));
        else if (!gameDocument.competencies.includes(competenceDocument.id))
            next(new LogicError(req.originalUrl, "Компетенция с указанным id не относится к игре."));
        else {
            res.locals.competenceDocument = competenceDocument;
            next();
        }
    }
));

gameCompetenciesRouter.get("/", 
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const competenciesDocuments: Array<HydratedDocument<ICompetence>> 
            = await Competence.find({ id: { $in: res.locals.gameDocument.competencies }});

        res.send(competenciesDocuments.map(c => new CompetenceDTO(c)));
    }
));

gameCompetenciesRouter.put("/", 
    body("id").isUUID(),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;
        const competenceDocument: HydratedDocument<ICompetence> = 
            await Competence.findOne({ id: req.body.id });

        if (competenceDocument === null)
            next(new LogicError(req.originalUrl, "Компетенции с указанным id не существует."));
        else if (gameDocument.competencies.includes(competenceDocument.id))
            next(new LogicError(req.originalUrl, "Компетенция уже относится к данной игре."));
        else {
            res.locals.competenceDocument = competenceDocument;

            next();
        }
    }),
    validateToken, 
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;

        const user: any = req.user;

        if (gameDocument.author.id !== user.id && user.role !== Role.Admin)
            next(new AccessError(req.originalUrl));
        else
            next();
    }),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;
        const competenceDocument: HydratedDocument<ICompetence> = res.locals.competenceDocument;

        gameDocument.competencies.push(competenceDocument.id);

        await gameDocument.save();

        res.json(new CompetenceDTO(competenceDocument));
    })
);

gameCompetenciesRouter.delete("/:competenceId", 
    validateToken,
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;

        const user: any = req.user;

        if (gameDocument.author.id !== user.id && user.role !== Role.Admin)
            next(new AccessError(req.originalUrl));
        else
            next();
    }),
    asyncMiddleware(async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        const user: any = req.user;
        const gameDocument: HydratedDocument<IGamePopulated> = res.locals.gameDocument;
        const competenceDocument: HydratedDocument<ICompetence> = res.locals.competenceDocument;

        gameDocument.competencies.splice(gameDocument.competencies.indexOf(competenceDocument.id));

        await gameDocument.save();

        res.json(new CompetenceDTO(competenceDocument));
    })
);

export default gameCompetenciesRouter;
