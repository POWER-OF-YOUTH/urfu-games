import mongoose, { Schema, Document } from "mongoose";

enum Role {
    User,
    Admin
}

interface IUser {
    id: string;
    name: string;
    surname: string;
    patronymic: string;
    login: string;
    email: string;
    password: string;
    role: Role;
    avatar: string;
    createdAt: Date;
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
            index: true
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
        role: {
            type: Number,
            default: Role.User
        },
        avatar: {
            type: String,
            default: "https://i.ibb.co/C9VKrMC/default-avatar.png"
        },
        createdAt: {
            type: Date
        }
    },
    { versionKey: false }
);

const User = mongoose.model<IUser>("User", userSchema);

type UserDocument = IUser & Document<any, any, IUser>;

export default User;
export {
    IUser,
    User,
    UserDocument,
    Role
};
