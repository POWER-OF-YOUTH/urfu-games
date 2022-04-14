import { GameDocument } from "../models/game";
import { UserDocument } from "../models/user";
import UserDTO from "./user-dto";

class GameSearchResultDTO {
    public readonly id: string;
    public readonly image: string;
    public readonly name: string;
    public readonly rating: number;
    public readonly author: UserDTO;
    public readonly createdAt: Date;
    public readonly uploaded: boolean;

    constructor(
        game: Readonly<GameDocument>, 
        author: Readonly<UserDocument>, 
    ) {
        this.id = game.id;
        this.image = game.image;
        this.name = game.name;
        this.rating = game.rating;
        this.author = new UserDTO(author);
        this.createdAt = game.createdAt;
        this.uploaded = game.uploaded;
    }

    static async create(
        game: Readonly<GameDocument>, 
        author?: Readonly<UserDocument>, 
    ): Promise<GameSearchResultDTO> {
        if (author === undefined)
            author = await game.getAuthor();

        return new GameSearchResultDTO(game, author);
    }
}

export default GameSearchResultDTO;
