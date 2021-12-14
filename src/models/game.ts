import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "./user";

interface IGame {
    id: string;
    competencies: Array<string>;
    image: string;
    name: string;
    description: string;
    rating: number;
    author: Schema.Types.ObjectId;
    participants: Array<Schema.Types.ObjectId>;
    url: string;
    uploaded: boolean;
    createdAt: Date;
}

interface IGamePopulated {
    id: string;
    competencies: Array<string>;
    image: string;
    name: string;
    description: string;
    rating: number;
    author: IUser;
    participants: Array<IUser>;
    url: string;
    uploaded: boolean;
    createdAt: Date;
}

const gameSchema = new Schema<IGame>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        competencies: {
            type: [String],
            required: true
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
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
            autopopulate: true
        },       
        participants: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "User",
            }],
            default: [],
            autopopulate: true
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

gameSchema.plugin(require("mongoose-autopopulate"));

// @ts-ignore
const Game = mongoose.model<IGamePopulated>("Game", gameSchema);

export default Game;
export {
    IGame,
    IGamePopulated,
    Game
};
