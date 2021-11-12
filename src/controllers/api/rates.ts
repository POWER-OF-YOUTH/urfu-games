import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";

import { LogicError } from "../../utils/errors";
import { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { IRating, Rating } from "../../models/rating";
import { DTO } from "../../utils/dto/rate";

type RateDocument = IRating & Document<any, any, IRating>;

type SubmitRateType = {
    gameId: string,
    value: number
};

type GetRatesType = {
    gameId?: string,
    authorId?: string
};

export async function submitRate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <SubmitRateType> matchedData(req, { locations: ["body"] });
        const user: any = req.user;

        const id: string = uuid();
        const rate: RateDocument = await Rating.create({ 
            ...data,
            id,
            author: user.id,
            createdAt: Date.now() // Отстрел ноги в будущем, I think
        });
        
        res.json(new DTO.Rate(rate));
    }
    catch (err) {
        next(err);
    }
}

export async function getRates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <GetRatesType> matchedData(req, { locations: ["body"] });

        if (!data.gameId && !data.authorId) {
            res.status(400).json({ errors: [
                new LogicError(req.originalUrl, "Не передано ни одного параметра.")
            ]});
        }

        const filter: any = {};
        if (data.gameId)
            filter.gameId = data.gameId;
        if (data.authorId)
            filter.author = data.authorId;

        const rates = await Rating.find(filter);

        res.json(rates.map(rate => new DTO.Rate(rate)));
    }
    catch (err) {
        next(err)
    }
}