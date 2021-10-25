import { IGame } from "../../models/game";

export namespace DTO {
    export class Game {
        public readonly id: string;
        public readonly competencies: Array<string>;
        public readonly image: string;
        public readonly name: string;
        public readonly description: string;
        public readonly rating: number;
        public readonly author: string;
        public readonly participants: Array<string>;
        public readonly url: string;
        public readonly createdAt: Date;

        constructor(game: IGame) {
            this.id = game.id;
            this.competencies = game.competencies;
            this.image = game.image;
            this.name = game.name;
            this.description = game.description;
            this.rating = game.rating;
            this.author = game.author;
            this.participants = game.participants;
            this.url = game.url;
            this.createdAt = game.createdAt;
        }
    }
}
