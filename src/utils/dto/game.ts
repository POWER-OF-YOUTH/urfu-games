import { IGamePopulated } from "../../models/game";
import UserDTO from "./user";

export default class GameDTO {
    public readonly id: string;
    public readonly competencies: Array<string>;
    public readonly image: string;
    public readonly name: string;
    public readonly description: string;
    public readonly rating: number;
    public readonly author: UserDTO;
    public readonly participants: Array<UserDTO>;
    public readonly url: string;
    public readonly createdAt: Date;
    public readonly uploaded: boolean;

    constructor(game: IGamePopulated) {
        this.id = game.id;
        this.competencies = game.competencies;
        this.image = game.image;
        this.name = game.name;
        this.description = game.description;
        this.rating = game.rating;
        this.author = new UserDTO(game.author);
        this.participants = game.participants.map(p => new UserDTO(p));
        this.url = game.url;
        this.createdAt = game.createdAt;
        this.uploaded = game.uploaded;
    }
}
