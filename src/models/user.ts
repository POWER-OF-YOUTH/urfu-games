import mongoose, { Schema } from "mongoose";

interface IUser {
    id: string;
    name: string;
    surname: string;
    patronymic: string;
    login: string;
    email: string;
    password: string;
    privilege: string;
    avatar: string;
    registration_date: Date;
}

const userSchema = new Schema<IUser>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: {
            type: String,
            default: ""
        },
        surname: {
            type: String,
            default: ""
        },
        patronymic: {
            type: String,
            default: ""
        },
        login: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true
        },    
        password: {
            type: String,
            required: true
        },
        privilege: {
            type: String,
            default: "user"
        },
        avatar: {
            type: String,
            default: ""
        },
        registration_date: {
            type: Date,
            default: Date.now()
        }
    },
    { versionKey: false }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
export {
    IUser,
    User
};
