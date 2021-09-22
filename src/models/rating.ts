import mongoose, { mongo, Schema } from 'mongoose';

interface IRating {
    id: string;
    game_id: string;
    author: string;
    value: number;
    creation_date: Date;
}

const ratingSchema = new Schema<IRating>(
    {
        id: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        game_id: {
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
        creation_date: {
            type: Date,
            default: Date.now()
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
