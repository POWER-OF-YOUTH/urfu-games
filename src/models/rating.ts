import mongoose, { Schema } from "mongoose";

interface IRating {
    id: string;
    gameId: string;
    author: string;
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

const Rating = mongoose.model<IRating>("Rating", ratingSchema);

export default Rating;
export {
    IRating,
    Rating
};
