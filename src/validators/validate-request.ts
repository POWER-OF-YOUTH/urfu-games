import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { matchedData, Result } from "express-validator";

import { ValidationError } from "../utils/errors";

/*
 * validateRequest создаёт промежуточную функцию, которая
 * используя массив валидаторов validators проверяет объект req и
 * помещает проверенные данные в поле req.data. Если в процессе
 * валидации возникли ошибки, то первая из них передаётся
 * обработчику ошибок.
 */
function validateRequest(...validators: Array<any>) {
    return [
        ...validators,
        (req: Request, res: Response, next:NextFunction) => {
            const validationErrors: Result = validationResult.withDefaults({
                /* 
                 * formatter позволяет изменить представление ошибок,
                 * в данном случае все ошибки будут представляться 
                 * объектами ValidationError
                 */
                formatter: err => { 
                    return new ValidationError(
                        req.originalUrl, 
                        err.param, 
                        <string> err.location, 
                        err.msg
                    );
                }
            })(req);

            if (!validationErrors.isEmpty())
                return next(validationErrors.array()[0]);

            req.data = { ...req.data, ...matchedData(req) };

            next();
        }
    ]
}

export default validateRequest;
