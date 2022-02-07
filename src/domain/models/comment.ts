import mongoose, { Schema, HydratedDocument, Model } from "mongoose";

import { User, UserDocument } from "./user";
import { Game, GameDocument } from "./game";

interface IComment {
    id: string;
    game: string;
    author: string;
    text: string;
    createdAt: Date;
}

interface ICommentInstanceMethods { 
    getAuthor(): Promise<UserDocument>;

    getGame(): Promise<GameDocument>;
}

interface ICommentModel extends Model<IComment, any, ICommentInstanceMethods> { }

const commentSchema = new Schema<IComment, ICommentModel>(
    {
        id: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        game: {
            type: String,
            required: true,
            index: true
        },
        author: {
            type: String,
            required: true,
            index: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date
        }
    },
    { versionKey: false }
);

// instance methods
commentSchema.method("getAuthor", async function () {
    const author: UserDocument = await User.findOne({ id: this.author });

    if (author === null)
        throw new Error("Пользователь не найден.");

    return author; 
});

commentSchema.method("getGame", async function () {
    const game: GameDocument = await Game.findOne({ id: this.game });

    if (game === null)
        throw new Error("Игра не найдена");

    return game;
});
// ---

const Comment = mongoose.model<IComment, ICommentModel>("Comment", commentSchema);

type CommentDocument = HydratedDocument<IComment & ICommentInstanceMethods>;

export default Comment;
export {
    IComment,
    Comment,
    CommentDocument
};
