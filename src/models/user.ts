import mongoose, { Schema } from 'mongoose';

interface IUser {
    id: string;
    name: string;
    surname: string;
    patronymic: string;
    login: string;
    email: string;
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
        privilege: {
            type: String,
            default: "user"
        },
        avatar: {
            type: String,
            default: "none"
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
