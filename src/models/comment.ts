import mongoose, { Schema } from "mongoose";

interface IComment {
    id: string;
    game_id: string;
    author: string;
    text: string;
    creation_date: Date;
}

const commentSchema = new Schema<IComment>(
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

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
export {
    IComment,
    Comment
};
