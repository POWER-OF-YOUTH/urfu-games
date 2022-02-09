import strings from "../../../config/api/strings.json";

import express, { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { asyncMiddleware } from "middleware-async";
import { body, param, query } from "express-validator";
import { v4 as uuid } from "uuid";

import CompetenceDTO from "../../domain/dto/competence-dto";
import sendResponse from "../../utils/send-response";
import validateRequest from "../../validators/validate-request";
import verifyToken from "../../validators/verify-token";
import { AccessError, LogicError } from "../../utils/errors";
import { Competence, CompetenceDocument } from "../../domain/models/competence";
import { Role } from "../../domain/models/user";

const competenciesRouter = express.Router();

competenciesRouter.post("/", 
    verifyToken, 
    validateRequest(
        body("name")
            .isString()
            .isLength({ min: 1, max: 30 })
            .withMessage("Имя должно содержать от 1 до 30 символов."),
        body("description")
            .isString()
            .isLength({ min: 1, max: 5000 })
            .withMessage("Описание должно содержать от 1 до 5000 символов.")
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (req.user.role !== Role.Admin)
            next(new AccessError(req.originalUrl));

        if (await Competence.exists({ name: req.data.name })) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.competenceWithNameAlreadyExists
            ));
        }

        const competence: CompetenceDocument = await Competence.create({
            id: uuid(),
            name: req.data.name,
            description: req.data.description,
            createdAt: Date.now()
        });

        sendResponse(
            res, 
            await CompetenceDTO.create(competence)
        );
    })
);

competenciesRouter.get("/:competenceId", 
    validateRequest(
        param("competenceId")
            .isUUID()
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const competence: CompetenceDocument = await Competence.findOne({ id: req.data.competenceId });

        if (competence === null) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.competenceWithIdNotExist
            ));
        }

        sendResponse(
            res, 
            await CompetenceDTO.create(competence)
        );
    })
);

competenciesRouter.get("/", 
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
        const competencies: Array<CompetenceDocument> = await Competence.find()
            .sort("name")
            .skip(req.data.start)
            .limit(req.data.count);

        sendResponse(
            res, 
            await Promise.all(
                competencies.map(c => CompetenceDTO.create(c))
            )   
        );
    })
);

competenciesRouter.put("/:competenceId", 
    verifyToken,
    validateRequest(
        param("competenceId")
            .isUUID(),
        body("name")
            .optional()
            .isString()
            .isLength({ min: 1, max: 30 })
            .withMessage("Имя должно содержать от 1 до 30 символов."),
        body("description")
            .optional()
            .isString()
            .isLength({ min: 1, max: 5000 })
            .withMessage("Описание должно содержать от 1 до 5000 символов.")
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const competence: CompetenceDocument = await Competence.findOne({ id: req.data.competenceId });

        if (req.user.role !== Role.Admin)
            next(new AccessError(req.originalUrl));

        if (competence === null) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.competenceWithIdNotExist
            ));
        }

        competence.set({ 
            name: req.data.name, 
            description: req.data.description 
        });

        await competence.save();

        sendResponse(
            res, 
            await CompetenceDTO.create(competence)
        );
    })
);

competenciesRouter.delete("/:competenceId",
    verifyToken,
    validateRequest(
        param("competenceId")
            .isUUID(),
    ),
    asyncMiddleware(async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const competence: CompetenceDocument = await Competence.findOne({ 
            id: req.data.competenceId 
        });

        if (req.user.role !== Role.Admin)
            next(new AccessError(req.originalUrl));

        if (competence === null) {
            next(new LogicError(
                req.originalUrl, 
                strings.errors.logic.competenceWithIdNotExist
            ));
        }

        await competence.delete();

        sendResponse(
            res, 
            await CompetenceDTO.create(competence)
        );
    })
);

export default competenciesRouter;
