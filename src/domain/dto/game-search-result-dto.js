import UserDTO from "./user-dto";

class GameSearchResultDTO {
    constructor(game, author) {
        this.id = game.id;
        this.image = game.image;
        this.name = game.name;
        this.rating = game.rating;
        this.author = new UserDTO(author);
        this.createdAt = game.createdAt;
        this.uploaded = game.uploaded;
    }

    static async create(game){
        return new GameSearchResultDTO(
            game,
            await game.getAuthor()
        );
    }
}

export default GameSearchResultDTO;
