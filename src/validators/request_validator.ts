import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../utils/api_errors";

function createCustomValidationResult(req: Request) {
    return validationResult.withDefaults({
        formatter: err => {
            return new ValidationError(req.originalUrl, err.param, <string> err.location, err.msg);
        }
    })(req);
}

function requestValidator(req: Request, res: Response, next: NextFunction): void {
    const errors = createCustomValidationResult(req).array();

    if(errors.length > 0)
        res.status(422).json({ errors });
    else
        next();
}

export default requestValidator;