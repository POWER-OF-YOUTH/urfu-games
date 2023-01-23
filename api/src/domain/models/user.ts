/**
 * @file Определение модели пользователя.
 */

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Model, DataTypes, Op } from "sequelize";

import Checkpoint from "./checkpoint";
import Comment from "./comment";
import Rating from "./rating";
import UserCheckpoints from "./user-checkpoints";
import UserProgress from "./user-progress";
import sequelize from "../../sequelize";
import { LogicError } from "../../utils/errors";

const DEFAULT_USER_AVATAR = "https://i.ibb.co/C9VKrMC/default-avatar.png";

/** Роли пользователя. */
enum Role {
    User,
    Admin,
    Moderator
}

/**
 * Модель пользователя.
 * @attention Удаление пользователя вызывает удаление связанных с ним
 * комментариев, оценок игр и проч.
 */
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
    /** Роль (User, Admin и т.д). */
    declare role: Role;
    /** Ссылка на аватар. */
    declare avatar: string;
    /** Дата создания аккаунта. */
    declare createdAt: Date;
}

User.init({
    id: {
        type: DataTypes.STRING,
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

// Связи с другими сущностями {
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
});

User.hasMany(UserProgress, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: {
        singular: "progress",
        plural: "progresses"
    }
});
UserProgress.belongsTo(User, {
    as: "user"
});
// } Связи с другими сущностями

// Сложные сценарии и вспомогательные функции {
type UserData = {
    login: string,
    email: string,
    password: string
}
/**
 * Создаёт пользователя.
 * @param userData Данные пользователя.
 * @returns Объект пользователя.
 */
async function createUser({ login, email, password }: UserData): Promise<User> {
    const transaction = await sequelize.transaction();

    try {
        let user = await User.findOne({
            transaction,
            where: { [Op.or]: [{ login }, { email }] }
        });
        if (user !== null) {
            throw new LogicError(
                "Пользователь с указанным 'login' или 'email' уже существует."
            );
        }

        password = encryptPassword(password, process.env.USER_PWD_SALT);
        user = await User.create({ login, email, password }, { transaction });

        await transaction.commit();

        return user;
    }
    catch (err) {
        await transaction.rollback();
        throw err;
    }
}
/**
 * Выполняет хеширование пароля пользователя.
 * @param password Пароль пользователя.
 * @param salt Соль.
 * @returns Хеш пароля пользователя.
 */
function encryptPassword(password: string, salt: string): string {
    return crypto.createHmac("sha1", salt).update(password).digest("hex");
}

/**
 * Генерирует JWT, который содержит поле `id` в качестве полезной нагрузки.
 * @param id Идентификатор пользователя.
 * @returns Json Web Token.
 */
function generateJWT(id: string): string {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

async function deleteUser(id: string) {
    await sequelize.transaction(async (transaction) => {
        const toDelete = await User.findByPk(id, { transaction, rejectOnEmpty: true });
        await toDelete.destroy({ transaction });
    }
    );
}

// } Сложные сценарии и вспомогательные функции

export default User;
export {
    User,
    Role,
    createUser,
    encryptPassword,
    generateJWT,
    deleteUser,
};
