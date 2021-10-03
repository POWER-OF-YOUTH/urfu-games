import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import multer, { diskStorage } from "multer";
import path from "path";
import fs from "fs";

import { DatabaseError, LogicError } from "../../utils/errors";
import { Game, IGame } from "../../models/game";
import { Document } from "mongoose";
import { matchedData } from "express-validator";

type GameDocument = IGame & Document<any, any, IGame>;

type GetGameData = {
    id: string
};

type AddGameData = {
    competencies: Array<string>,
    image: string,
    name: string,
    description: string,
    author: string,
    participant: Array<string>
}

async function getGames(req: Request, res: Response): Promise<void> {
    try {
        const games: Array<GameDocument> = await Game.find();

        res.json(games.map(game => {
            return {
                id: game.id,
                competencies: game.competencies,
                image: game.image,
                name: game.name,
                description: game.description,
                rating: game.rating,
                author: game.author,
                participants: game.participants,
                url: game.url,
                creation_date: game.creation_date
            };
        }));
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
    }
}

async function getGame(req: Request, res: Response): Promise<void> {
    try {
        const data = <GetGameData> matchedData(req, { locations: [ "params" ] });

        const game: GameDocument = await Game.findOne({ id: data.id });

        res.json({
            id: game.id,
            competencies: game.competencies,
            image: game.image,
            name: game.name,
            description: game.description,
            rating: game.rating,
            author: game.author,
            participants: game.participants,
            url: game.url,
            creation_date: game.creation_date
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
    }
}

async function addGame(req: Request, res: Response) {
    try {
        const data = <AddGameData> matchedData(req, { locations: ["body"] });
        
        const id: string = uuid();
        const game: GameDocument = await Game.create({ 
            ...data,
            id,
            url: `/games/${id}`
        });

        res.json({
            id: game.id,
            competencies: game.competencies,
            image: game.image,
            name: game.name,
            description: game.description,
            rating: game.rating,
            author: game.author,
            participants: game.participants,
            url: game.url,
            creation_date: game.creation_date
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
    }
}

const uploadGame = [
    multer({ 
        storage: 
            diskStorage({
                destination(req: Request, file: Express.Multer.File, cb: (error: Error, destination: string) => void) {
                    const directory: string = path.join(process.env.PUBLIC_DIR, "/games", req.params.id);

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
    async (req: Request, res: Response) => {
        try {
            if (req.files.length === 0) {
                res.status(400).json({ errors: [
                    new LogicError(req.originalUrl, "Ни одного файла не было загружено.")
                ]});
            }
    
            const game: GameDocument = await Game.findOne({ id: req.params.id });
    
            const filesLoaded: Array<string> = [];
            for (const file of <Array<Express.Multer.File>> req.files)
                filesLoaded.push(file.originalname);
    
            game.uploaded = true; 
    
            await game.save();
    
            res.json({ filesLoaded });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
        }
    }
];

const gamesController = {
    getGames,
    getGame,
    addGame,
    uploadGame
};

export default gamesController;
