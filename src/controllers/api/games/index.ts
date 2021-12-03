import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";
import multer, { diskStorage } from "multer";
import path from "path";
import fs from "fs";
import { matchedData } from "express-validator";

import { LogicError, AccessError } from "../../../utils/errors";
import { Competence, CompetenceDocument } from "../../../models/competence";
import { User, UserDocument, Role } from "../../../models/user";
import { Game, GameDocument, IGamePopulated } from "../../../models/game";
import Comment from "../../../models/comment";
import GameDTO from "../../../utils/dto/game";


type AddGameData = {
    competencies: Array<string>,
    name: string,
    description: string,
    participants: Array<string>
}

export async function addGame(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <AddGameData> matchedData(req, { locations: [ "body" ] });
        const user: any = req.user;

        const author = await User.findOne({ id: user.id });
        const participants: Array<UserDocument> = await User.find({ 
            id: { $in: data.participants }
        });
        const competencies: Array<CompetenceDocument> = await Competence.find({ 
            id: { $in: data.competencies }
        });
        if (participants.length !== data.participants.length) {
            res.status(422).json({ errors: [
                new LogicError(req.originalUrl, "Один или несколько участников не найдены.")
            ]});
        }
        else if (competencies.length !== data.competencies.length) {
            res.status(422).json({ errors: [
                new LogicError(req.originalUrl, "Одна или несколько компетенций не найдены.")
            ]});
        }
        else {
            // Create game entity
            const id: string = uuid();
            const game: GameDocument = await Game.create({ 
                ...data,
                id,
                author: author._id,
                participants: participants.map(p => p._id),
                competencies: competencies.map(c => c.id),
                url: path.join("/public", process.env.PUBLIC_GAMES_SUBDIR, id),
                createdAt: Date.now()
            });

            await game.populate("author");
            await game.populate("participants");

            // @ts-ignore
            res.json(new GameDTO(game));
        }
    }
    catch (err) {
        next(err);
    }
}

type GetGameData = {
    gameId: string
};

export async function getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <GetGameData> matchedData(req, { locations: [ "params" ] });
        const game: IGamePopulated = await Game
            .findOne({ id: data.gameId })
            .populate("author")
            .populate("participants");

        if (!game) {
            res.status(404).json({ errors: [ 
                new LogicError(req.originalUrl, "Игры с указанным id не существует.") 
            ]});
        }
        else
            res.json(new GameDTO(<IGamePopulated> game));
    }
    catch (err) {
        next(err);
    }
}

export async function getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const games: Array<IGamePopulated> = await Game
            .find()
            .populate("author")
            .populate("participants");

        res.json(games.map(g => new GameDTO(g)));
    }
    catch (err) {
        next(err);
    }
}

type UpdateGameData = {
    gameId: string,
    competencies: Array<string> | undefined,
    name: string | undefined,
    description: string | undefined,
    participants: Array<string> | undefined
}

export async function updateGame(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <UpdateGameData> matchedData(req, { locations: [ "body", "params" ] });
        const user: any = req.user;
        const game: GameDocument = await Game.findOne({ id: data.gameId });

        const competencies: Array<CompetenceDocument> = await Competence.find({ 
            id: { $in: data.competencies }
        });
        if (!game) {
            res.status(404).json({ errors: [ 
                new LogicError(req.originalUrl, "Игры с указанным id не существует.") 
            ]});
        }
        else if (competencies.length !== data.competencies.length) {
            res.status(422).json({ errors: [
                new LogicError(req.originalUrl, "Одна или несколько компетенций не найдены.")
            ]});
        }
        else if (game.author !== user.id && user.role !== Role.Admin) 
            res.status(403).json({ errors: [ new AccessError(req.originalUrl) ] });
        else {
            if (data.participants) { // convert participants ids to _id
                const participants = await User.find({ id: { $in: data.participants }});
                data.participants = participants.map(p => p._id);
            }

            game.set(data);

            await game.save();

            await game.populate("author");
            await game.populate("participants");

            // @ts-ignore
            res.json(new GameDTO(game));
        }
    }
    catch(err) {
        next(err);
    }
}

export const uploadGame = [
    async (req: Request, res: Response, next: NextFunction) => {
        if (!Game.exists({ id: req.params.id })) {
            res.status(422).json({ errors: [ 
                new LogicError(req.originalUrl, "Игры с указанным id не существует.") 
            ]});
        }
        else
            next();
    },
    multer({ 
        storage: 
            diskStorage({
                destination(req: Request, file: Express.Multer.File, cb: (error: Error, destination: string) => void) {
                    const directory: string = path.join("/public", process.env.PUBLIC_GAMES_SUBDIR, req.params.id);

                    // Создадим директорию, если её не существует
                    if (!fs.existsSync(directory)) 
                        fs.mkdirSync(directory, { recursive: true });

                    cb(null, directory);
                },
                filename(req: Request, file: Express.Multer.File, cb: (error: Error, filename: string) => void) {
                    cb(null, file.originalname);
                }
            })
    })
        .array("files", 50),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.files.length === 0) {
                res.status(400).json({ errors: [
                    new LogicError(req.originalUrl, "Ни одного файла не было загружено.")
                ]});
            }
            else {
                const game: GameDocument = await Game.findOne({ id: req.params.id });
    
                const filesLoaded: Array<string> = [];
                for (const file of <Array<Express.Multer.File>> req.files)
                    filesLoaded.push(file.originalname);
    
                game.uploaded = true; 
    
                await game.save();
    
                res.json({ filesLoaded });
            }
        }
        catch (err) {
            next(err);
        }
    }
];

type DeleteGameData = {
    gameId: string
}

export async function deleteGame(req: Request, res: Response, next: NextFunction) {
    try {
        const data = <DeleteGameData> matchedData(req, { locations: [ "params" ] });
        const game: GameDocument = await Game.findOne({ id: data.gameId });
        const user: any = req.user;

        if (!game) {
            res.status(422).json({ errors: [ 
                new LogicError(req.originalUrl, "Игры с указанным id не существует.") 
            ]});
        }
        else if (game.author !== user.id && user.role !== Role.Admin) 
            res.status(403).json({ errors: [ new AccessError(req.originalUrl) ] });
        else {
            const directory: string = path.join("/public" + process.env.PUBLIC_GAMES_SUBDIR, data.gameId);

            await game.delete();

            // Удаляем директорию, содержащую файлы игры, если она существует
            if (fs.existsSync(directory))
                fs.rmSync(directory, { recursive: true });

            // Удаляем комментарии, относящиеся к игре
            await Comment.deleteMany({ gameId: game.id }); 

            await game.populate("author");
            await game.populate("participants");

            // @ts-ignore
            res.json(new GameDTO(game));
        }
    }
    catch (err) {
        next(err);
    }
}

