import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

function requestValidator(req: Request, res: Response, next: any) {
    const errors = validationResult(req);

    if(!errors.isEmpty())
        res.status(422).json(errors);
    else
        next();
}

export default requestValidator;