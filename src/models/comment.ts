import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";

interface IComment {
    id: string;
    gameId: string;
    author: IUser;
    text: string;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        id: {
            type: String,
            required: true,
            index: true,
            unique: true
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
            index: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
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
