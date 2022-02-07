import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { ValidationError } from "../utils/errors";

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
        next(errors[0]);
    else
        next();
}

export default requestValidator;
