class GameDTO {
    constructor(game) {
        this.id = game.id;
        this.image = game.image;
        this.name = game.name;
        this.description = game.description;
        this.rating = game.rating;
        this.author = game.author;
        this.participants = game.participants;
        this.createdAt = game.createdAt;
        this.rating = game.rating;
        this.isPublicated = game.isPublicated;
    }

    static async create(game) {
        return new GameDTO(game);
    }
}

export default GameDTO;
