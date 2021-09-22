import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            index: true,
            unique: true
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
        text: {
            type: String,
            required: true
        },
        creation_date: {
            type: Date,
            default: Date.now()
        }
    },
    { versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
