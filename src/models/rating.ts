import mongoose, { Schema } from "mongoose";

import { IUser } from "./user";

interface IRating {
    id: string;
    gameId: string;
    author: Schema.Types.ObjectId;
    value: number;
    createdAt: Date;
}

interface IRatingPopulated {
    id: string;
    gameId: string;
    author: IUser;
    value: number;
    createdAt: Date;
}

const ratingSchema = new Schema<IRating>(
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
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
            autopopulate: true
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

ratingSchema.plugin(require("mongoose-autopopulate"));

// @ts-ignore
const Rating = mongoose.model<IRatingPopulated>("Rating", ratingSchema);

export default Rating;
export {
    IRating,
    IRatingPopulated,
    Rating
};
