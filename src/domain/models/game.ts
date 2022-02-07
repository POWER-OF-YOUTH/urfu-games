import mongoose, { Schema, HydratedDocument, Model } from "mongoose";

import { User, UserDocument } from "./user";

interface IGame {
    id: string;
    competencies: Array<string>;
    image: string;
    name: string;
    description: string;
    rating: number;
    author: string;
    participants: Array<string>;
    url: string;
    uploaded: boolean;
    createdAt: Date;
}

interface IGameInstaceMethods { 
    getAuthor(): Promise<UserDocument>;

    getParticipants(): Promise<Array<UserDocument>>;

    // getCompetencies(): Promise<Array<CompetenceDocument>>;
}

interface IGameModel extends Model<IGame, any, IGameInstaceMethods> { }

const gameSchema = new Schema<IGame, IGameModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        competencies: {
            type: [String],
            default: []
        },
        image: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        rating: { // Число [0;5]
            type: Number,
            default: 0
        },
        author: {
            type: String,
            ref: "User",
            required: true,
            index: true
        },       
        participants: {
            type: [String],
            default: []
        },
        url: {
            type: String,
            required: true
        },
        uploaded: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date
        }
    },
    { versionKey: false }
);

// instance methods
gameSchema.method("getAuthor", async function () {
    const author: UserDocument = await User.findOne({ id: this.author }); 

    if (author === null)
        throw new Error("Пользователь не найден.");

    return author;
});

gameSchema.method("getParticipants", async function () {
    const participants: Array<UserDocument> = await User.find({ 
        id: { $in: this.participants }
    });

    if (participants.length !== this.participants.length) {
        throw new Error("Один или несколько участников не найдены.");
    }

    return participants;
});
// ---

const Game = mongoose.model<IGame, IGameModel>("Game", gameSchema);

type GameDocument = HydratedDocument<IGame & IGameInstaceMethods>;

export default Game;
export {
    IGame,
    Game,
    GameDocument
};
