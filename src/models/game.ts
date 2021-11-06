import mongoose, { Schema, Document } from "mongoose";

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
            type: String,
            required: true
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

const Game = mongoose.model<IGame>("Game", gameSchema);

export default Game;
export {
    IGame,
    Game
};
