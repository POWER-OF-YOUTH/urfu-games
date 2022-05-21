import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const DEFAULT_USER_AVATAR = "https://i.ibb.co/C9VKrMC/default-avatar.png";

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
    checkpoints: Array<string>;
    createdAt: Date;
}

interface IUserInstanceMethods { 
    generateJWT(): string;
}

interface IUserModel extends Model<IUser, any, IUserInstanceMethods> {
    encryptPassword(password: string, salt: string): string;

    findByLogin(login: string): Promise<UserDocument>;

    findByEmail(email: string): Promise<UserDocument>;
}

const userSchema = new Schema<IUser, IUserModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: {
            type: String,
            default: null
        },
        surname: {
            type: String,
            default: null
        },
        patronymic: {
            type: String,
            default: null
        },
        login: {
            type: String,
            required: true,
            unique: true
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
            default: DEFAULT_USER_AVATAR
        },
        checkpoints: {
            type: [String],
            default: []
        },
        createdAt: { 
            type: Date, 
            required: true
        }
    },
    { versionKey: false }
);

userSchema.index({ login: "text" });

userSchema.method("generateJWT", function () {
    return jwt.sign(
        { id: this.id, role: this.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    )
});

userSchema.static("encryptPassword", (password: string, salt: string) =>
    crypto.createHmac("sha1", salt).update(password).digest("hex")
);

userSchema.static("findByLogin", (login: string) => User.findOne({ login }));

userSchema.static("findByEmail", (email: string) => User.findOne({ email }));

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

type UserDocument = HydratedDocument<IUser & IUserInstanceMethods>;

export default User;
export {
    IUser,
    User,
    Role,
    UserDocument
};
