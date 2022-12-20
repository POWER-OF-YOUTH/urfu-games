/**
 * @file Определение модели игры.
 */

import { Model, DataTypes } from "sequelize";

import Checkpoint from "./checkpoint";
import Comment from "./comment";
import Competence from "./competence";
import GameCompetencies from "./game-competencies";
import Rating from "./rating";
import UserProgress from "./user-progress";
import sequelize from "../../sequelize";
import { AccessError, LogicError } from "../../utils/errors";
import { GameParticipants, ParticipantRole } from "./game-participants";
import { User, Role } from "./user";

/**
 * Модель игры.
 * @attention Удаление игры вызывает удаление связанных с ней
 * комментариев, оценок, прогрессов и чекпоинтов.
 */
class Game extends Model {
    /** Уникальный идентификатор игры. */
    declare id: string;
    declare authorId: string;
    /** Обложка игры. */
    declare image: string;
    /** Название игры. */
    declare name: string;
    /** Описание игры. */
    declare description: string;
    declare loaderUrl: string;
    declare dataUrl: string;
    declare frameworkUrl: string;
    declare codeUrl: string;
    /** Рейтинг игры. */
    declare rating: number;
    /**
     * Флаг, который содержит значение `true`
     * если игра опубликована, - `false` в ином случае.
     */
    declare isPublicated: boolean;
    /** Количество чекпоинтов в игре. */
    declare checkpointsCount: number;
    /** Дата создания игры. */
    declare createdAt: Date;
}

Game.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4, primaryKey: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
    },
    loaderUrl: {
        type: DataTypes.STRING
    },
    dataUrl: {
        type: DataTypes.STRING
    },
    frameworkUrl: {
        type: DataTypes.STRING
    },
    codeUrl: {
        type: DataTypes.STRING
    },
    rating: {
        type: DataTypes.FLOAT(8),
        defaultValue: 0,
        allowNull: false
    },
    isPublicated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    checkpointsCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize, modelName: "Game" });

// Связи с другими сущностями {
Game.belongsToMany(User, {
    through: GameParticipants,
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "participant",
        plural: "participants"
    }
});
User.belongsToMany(Game, {
    through: GameParticipants,
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: {
        singular: "game",
        plural: "games"
    }
});

Game.belongsToMany(Competence, {
    through: GameCompetencies,
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "competence",
        plural: "competencies"
    }
});
Competence.belongsToMany(Game, {
    through: GameCompetencies,
    foreignKey: "competenceId",
    onDelete: "CASCADE",
    as: {
        singular: "game",
        plural: "games"
    }
});

Game.hasMany(Comment, {
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "comment",
        plural: "comments"
    }
});
Comment.belongsTo(Game, {
    as: "game"
});

Game.hasMany(Rating, {
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "rating",
        plural: "ratings"
    }
});
Rating.belongsTo(Game, {
    as: "game"
});

Game.hasMany(Checkpoint, {
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "checkpoint",
        plural: "checkpoints"
    }
});
Checkpoint.belongsTo(Game, {
    as: "game"
});

Game.hasMany(UserProgress, {
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "progress",
        plural: "progresses"
    }
});
UserProgress.belongsTo(Game, {
    as: "game"
});
// } Связи с другими сущностями

// Сложные сценарии и вспомогательные функции {
type GameData = {
    name: string,
    description: string,
    image: string,
    loaderUrl: string,
    dataUrl: string,
    frameworkUrl: string,
    codeUrl: string,
    checkpoints: Array<CheckpointData>
};
type CheckpointData = {
    name: string,
    competence: Competence,
    description: string
};
/**
 * Создаёт игру.
 * @param initiator Инициатор создания игры.
 * @param author Автор игры.
 * @param participants Участники.
 * @param competencies Компетенции.
 * @param gameData Информация об игре.
 * @returns Объект игры.
 */
async function createGame(
    initiator: User,
    author: User,
    participants: Array<User>,
    competencies: Array<Competence>,
    gameData: GameData
): Promise<Game> {
    if (initiator.role !== Role.Admin && initiator.id !== author.id && initiator.role !== Role.Moderator) {
        throw new AccessError(
            "Только администратор или модератор может создать игру от имени другого пользователя"
        );
    }
    if (competencies.length === 0) {
        throw new LogicError("Список компетенций не может быть пуст.");
    }
    if (gameData.checkpoints.length === 0) {
        throw new LogicError("Список чекпоинтов не может быть пуст.");
    }

    const transaction = await sequelize.transaction();
    try {
        const game = await Game.create({
            name: gameData.name,
            description: gameData.description,
            image: gameData.image,
            loaderUrl: gameData.loaderUrl,
            dataUrl: gameData.dataUrl,
            frameworkUrl: gameData.frameworkUrl,
            codeUrl: gameData.codeUrl,
            checkpointsCount: gameData.checkpoints.length
        }, { transaction });
        // @ts-ignore
        await game.setCompetencies(competencies, { transaction });
        await Promise.all(
            // @ts-ignore
            gameData.checkpoints.map((c) => game.createCheckpoint(c, { transaction }))
        );
        await Promise.all(
            participants.map((p) =>
                // @ts-ignore
                game.addParticipant(
                    p,
                    {
                        transaction,
                        through: { role: ParticipantRole.Participant }
                    }
                )
            )
        );
        // @ts-ignore
        await game.addParticipant(
            author,
            { transaction, through: { role: ParticipantRole.Author }}
        );

        await transaction.commit();

        return game;
    }
    catch (err) {
        await transaction.rollback();
        throw err;
    }
}

/**
 * Обновляет игру `game`.
 * @param initiator Инициатор создания игры.
 * @param game Обновляемая игра.
 * @param participants Участники.
 * @param competencies Компетенции.
 * @param gameData Информация об игре.
 */
async function updateGame(
    initiator: User,
    game: Game,
    participants: Array<User>,
    competencies: Array<Competence>,
    gameData: GameData
): Promise<void> {
    if (initiator.role !== Role.Admin && initiator.id !== game.authorId && initiator.role !== Role.Moderator) {
        throw new AccessError(
            "Только администратор или модератор может обновить игру другого пользователя."
        );
    }
    if (competencies.length === 0) {
        throw new LogicError("Список компетенций не может быть пуст.");
    }
    if (gameData.checkpoints.length === 0) {
        throw new LogicError("Список чекпоинтов не может быть пуст.");
    }

    await sequelize.transaction(async (transaction) => {
        // @ts-ignore
        await game.setCompetencies(competencies, { transaction });
        // @ts-ignore
        await game.removeCheckpoints();
        await Promise.all(
            // @ts-ignore
            gameData.checkpoints.map((c) => game.createCheckpoint(c, { transaction }))
        );
        // @ts-ignore
        await game.setParticipants(
            participants,
            { transaction, through: { role: ParticipantRole.Participant }}
        );
        // @ts-ignore
        await game.addParticipant(
            initiator.id,
            {
                transaction,
                through: { role: ParticipantRole.Author }
            }
        );
        game.set({
            name: gameData.name,
            description: gameData.description,
            image: gameData.image,
            loaderUrl: gameData.loaderUrl,
            dataUrl: gameData.dataUrl,
            frameworkUrl: gameData.frameworkUrl,
            codeUrl: gameData.codeUrl,
            checkpointsCount: gameData.checkpoints.length
        });
        await game.save({ transaction });
    });
}

/**
 * Удаляет игру `game`.
 * @param initiator Инициатор удаления.
 * @param game Удаляемая игра.
 */
async function deleteGame(initiator: User, game: Game): Promise<void> {
    if (initiator.role !== Role.Admin && initiator.id !== game.authorId && initiator.role !== Role.Moderator) {
        throw new LogicError(
            "Только администратор или модератор может удалить игру другого пользователя."
        );
    }

    await game.destroy();
}
// } Сложные сценарии и вспомогательные функции

export default Game;
export {
    Game,
    createGame,
    updateGame,
    deleteGame
};
