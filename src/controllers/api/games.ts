import { v4 as uuid } from "uuid";
import { Request, Response } from "express";

import { DatabaseError, LogicError } from "../../utils/errors";
import { Game, IGame } from "../../models/game";

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
        const games: Array<IGame> = await Game.find();

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
        const data: GetGameData = <GetGameData> req.params;

        if (!await Game.exists({ id: data.id })) {
            res.status(404).json({ errors: [
                new LogicError(
                    req.originalUrl, 
                    "Игра с указанным id не найдена."
                )
            ]});
        }
        else {
            const game: IGame = <IGame> await Game.findOne({ id: data.id });

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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ errors: [ new DatabaseError(req.originalUrl) ]});
    }
}

async function addGame(req: Request, res: Response) {
    try {
        const data: AddGameData = <AddGameData> req.body;

        const game: IGame = <IGame> await Game.create({ id: uuid(), ...data});

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

const gamesController = {
    getGames,
    getGame,
    addGame
};

export default gamesController;