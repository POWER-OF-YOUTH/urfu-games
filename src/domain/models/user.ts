import { Model, DataTypes } from "sequelize";

import Comment from "./comment";
import Checkpoint from "./checkpoint";
import sequelize from "../../sequelize";
import Rating from "./rating";
import UserCheckpoints from "./user-checkpoints";

const DEFAULT_USER_AVATAR = "https://i.ibb.co/C9VKrMC/default-avatar.png";

enum Role {
    User,
    Admin
}

class User extends Model { 
    declare id: string;
    declare name: string;
    declare surname: string;
    declare patronymic: string;
    declare login: string;
    declare email: string;
    declare password: string;
    declare role: Role;
    declare avatar: string;
    declare createdAt: Date;
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    surname: {
        type: DataTypes.STRING
    },
    patronymic: {
        type: DataTypes.STRING
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Role.User
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: DEFAULT_USER_AVATAR
    }
}, { sequelize, modelName: "User" });

User.hasMany(Comment, {
    foreignKey: "authorId",
    onDelete: "CASCADE",
    as: {
        singular: "comment",
        plural: "comments"
    }
});
Comment.belongsTo(User, {
    as: "author"
});

User.hasMany(Rating, { 
    foreignKey: "authorId",
    onDelete: "CASCADE",
    as: { 
        singular: "rating",
        plural: "ratings"
    } 
});
Rating.belongsTo(User, { 
    as: "author" 
});

User.belongsToMany(Checkpoint, {
    through: UserCheckpoints,
    foreignKey: "userId",
    onDelete: "SET NULL",
    as: {
        singular: "checkpoint",
        plural: "checkpoints"
    }
});
Checkpoint.belongsToMany(User, {
    through: UserCheckpoints,
    foreignKey: "checkpointId",
    onDelete: "SET NULL",
    as: {
        singular: "user",
        plural: "users"
    }
})

export default User;
export { User, Role };
