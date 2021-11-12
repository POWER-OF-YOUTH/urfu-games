import { Game } from '../models/game';

export async function containsGame(id: string) {
    if (!await Game.exists({ id }))
        throw new Error("Игры с указанным id не существует.");
}
