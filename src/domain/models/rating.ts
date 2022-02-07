import mongoose, { 
    Schema, 
    HydratedDocument, 
    Model 
} from "mongoose";

import { User, UserDocument } from "./user";
import { Game, GameDocument } from "./game";

interface IRating {
    id: string;
    gameId: string;
    author: string;
    value: number;
    createdAt: Date;
}

interface IRatingInstanceMethods { 
    getAuthor(): Promise<UserDocument>;

    getGame(): Promise<GameDocument>;
}

interface IRatingModel extends Model<IRating, any, IRatingInstanceMethods> { }

const ratingSchema = new Schema<IRating, IRatingModel>(
    {
        id: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        gameId: {
            type: String,
            required: true,
            index: true
        },
        author: {
            type: String,
            required: true,
            index: true
        },
        value: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date
        }
    },
    { versionKey: false }
);

// instance methods
ratingSchema.method("getAuthor", async function () {
    const author: UserDocument = await User.findOne({ id: this.author });

    if (author === null)
        throw new Error("Пользователь не найден.");

    return author; 
});

ratingSchema.method("getGame", async function () {
    const game: GameDocument = await Game.findOne({ id: this.game });

    if (game === null)
        throw new Error("Игра не найдена");

    return game;
});
// ---

const Rating = mongoose.model<IRating, IRatingModel>("Rating", ratingSchema);

type RatingDocument = HydratedDocument<IRating & IRatingInstanceMethods>;

export default Rating;
export {
    IRating,
    IRatingInstanceMethods,
    Rating,
    RatingDocument
};
