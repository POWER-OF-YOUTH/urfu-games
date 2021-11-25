import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";

import { Competence, CompetenceDocument } from "../../models/competence";
import { User, UserDocument, Role } from "../../models/user";
import { LogicError, AccessError } from "../../utils/errors";
import CompetenceDTO from "../../utils/dto/competence";

type AddCompetenceData = {
    name: string,
    description: string
};

export async function addCompetence(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <AddCompetenceData> matchedData(req, { locations: [ "body" ]});
        const user: any = req.user;

        if (user.role !== Role.Admin)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl)]});
        else if (await Competence.exists({ name: data.name }))
        {
            res.status(422).json({ errors: [ 
                new LogicError(req.originalUrl, "Компетенция с таким именем уже существует.")
            ]});
        }
        else
        {
            const competence: CompetenceDocument = await Competence.create({
                ...data,
                id: uuid(),
                createdAt: Date.now()
            });

            res.json(new CompetenceDTO(competence));
        }
    }
    catch (err) {
        next(err);
    }
}

type GetCompetenceData = {
    competenceId: string
};

export async function getCompetence(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <GetCompetenceData> matchedData(req, { locations: [ "params" ]});

        const competence: CompetenceDocument | null = await Competence.findOne({ id: data.competenceId });

        if (competence === null) {
            res.status(404).json({ errors: [ 
                new LogicError(req.originalUrl, "Компетенции с указанным id не существует.")
            ]});
        }
        else
            res.json(new CompetenceDTO(competence));
    }
    catch (err) {
        next(err);
    }
}

type GetCompetenciesData = {
    start: number,
    count: number
};

export async function getCompetencies(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <GetCompetenciesData> matchedData(req, { locations: [ "query" ]}); console.log(data);

        const competencies: Array<CompetenceDocument> = await Competence.find()
            .sort("name").skip(data.start).limit(data.count);

        res.json(competencies.map(c => new CompetenceDTO(c)));
    }
    catch (err) {
        next(err);
    }
}

type UpdateCompetenceData = {
    competenceId: string,
    name: string | undefined,
    description: string | undefined
};

export async function updateCompetence(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <UpdateCompetenceData> matchedData(req, { locations: [ "params", "body" ]});
        const user: any = req.user;

        const competence: CompetenceDocument | null = await Competence.findOne({ id: data.competenceId });

        if (user.role !== Role.Admin)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl)]});
        else if (competence === null) {
            res.status(422).json({ errors: [
                new LogicError(req.originalUrl, "Компетенции с указанным id не существует.")
            ]});
        }
        else {
            competence.set(data);

            await competence.save();

            res.json(new CompetenceDTO(competence));
        }
    }
    catch (err) {
        next(err);
    }
}

type DeleteCompetenceData = {
    competenceId: string
};

export async function deleteCompetence(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <DeleteCompetenceData> matchedData(req, { locations: [ "params" ]});
        const user: any = req.user;

        const competence: CompetenceDocument | null = await Competence.findOne({ id: data.competenceId });

        if (user.role !== Role.Admin)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl)]});
        else if (competence === null) {
            res.status(422).json({ errors: [
                new LogicError(req.originalUrl, "Компетенции с указанным id не существует.")
            ]});
        }
        else {
            await competence.delete();

            res.json(new CompetenceDTO(competence));
        }
    }
    catch (err) {
        next(err);
    }
}
