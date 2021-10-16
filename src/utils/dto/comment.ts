import { IComment } from "../../models/comment";

export namespace DTO {
    export class Comment {
        public readonly id: string;
        public readonly gameId: string;
        public readonly author: string;
        public readonly text: string;
        public readonly createdAt: string;

        constructor(comment: IComment) {
            this.id = comment.id;
            this.gameId = comment.gameId;
            this.author = comment.author;
            this.text = comment.text;
            this.createdAt = comment.createdAt.toUTCString();
        }
    }
}
