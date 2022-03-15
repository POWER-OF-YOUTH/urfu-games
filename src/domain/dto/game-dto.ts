import { GameDocument } from "../models/game";

class GameDTO {
    public readonly id: string;
    public readonly image: string;
    public readonly name: string;
    public readonly description: string;
    public readonly rating: number;
    public readonly author: string;
    public readonly participants: Array<string>;
    public readonly createdAt: Date;
    public readonly uploaded: boolean;

    constructor(game: Readonly<GameDocument>) {
        this.id = game.id;
        this.image = game.image;
        this.name = game.name;
        this.description = game.description;
        this.rating = game.rating;
        this.author = game.author;
        this.participants = game.participants;
        this.createdAt = game.createdAt;
        this.uploaded = game.uploaded;
    }

    static async create(game: Readonly<GameDocument>): Promise<GameDTO> {
        return new GameDTO(game);
    }
}

export default GameDTO;
