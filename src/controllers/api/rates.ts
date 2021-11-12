import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";

import { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { IRating, Rating } from "../../models/rating";
import { DTO } from "../../utils/dto/rate";

type RateDocument = IRating & Document<any, any, IRating>;

type SubmitRateType = {
    gameId: string,
    value: number
};

export async function submitRate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <SubmitRateType> matchedData(req, { locations: ["body"] });
        const user: any = req.user;

        console.log(data);

        const id: string = uuid();
        const rate: RateDocument = await Rating.create({ 
            ...data,
            id,
            author: user.id,
        });
        
        res.json(new DTO.Rate(rate));
    }
    catch (err) {
        next(err);
    }
}
