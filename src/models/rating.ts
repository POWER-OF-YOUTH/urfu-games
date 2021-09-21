import mongoose, { mongo, Schema } from 'mongoose';

const ratingSchema = new Schema(
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

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
