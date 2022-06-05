/**
 * @file Опредение модели пользователя.
 */

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

/** Модель пользователя. */
class User extends Model { 
    declare id: string;
    /** Имя. */
    declare name: string;
    /** Фамилия. */
    declare surname: string;
    /** Отчество. */
    declare patronymic: string;
    /** Логин. */
    declare login: string;
    /** Адрес электронной почты. */
    declare email: string;
    /** Пароль. */ 
    declare password: string;
    /** Роль пользователя (User, Admin и т.д). */ 
    declare role: Role;
    /** Ссылка на аватар. */
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
        unique: true,
        validate: {
            is: /^[0-9A-Za-z]+$/
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9A-Za-z_\-@#%., ]+$/,
            len: {
                args: [ 6, 100 ],
                msg: "Длинна пароля должна быть в промежутке от 6 до 100 символов."
            }
        }
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Role.User,
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: DEFAULT_USER_AVATAR,
        validate: {
            isUrl: true
        }
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
