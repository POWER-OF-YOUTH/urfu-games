/**
 * @file Определение модели прогресса пользователя.
 */

import { Model, DataTypes } from "sequelize";

import Game from "./game";
import { AccessError, LogicError } from "../../utils/errors";
import { User, Role } from "./user";

import sequelize from "../../sequelize.js";

/** Модель прогресса пользователя. */
class UserProgress extends Model {
    /** Уникальный идентификатор прогресса пользователя. */
    declare id: string;
    /** Количество собранных чекпоинтов. */
    declare checkpointsCollected: number;
    /** Данные прогресса в виде JSON строки. */
    declare data: string;
    /** Идентификатор пользователя, к которому относится прогресс. */
    declare userId: string;
    /** Идентификатор игры, к которой относится прогресс. */
    declare gameId: string;
    /** Дата создания. */
    declare createdAt: Date;

    // Совокупность `gameId` и `userId` уникальна для каждой сущности `UserProgress`.
}

UserProgress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    checkpointsCollected: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    data: {
        type: DataTypes.STRING(1024),
        defaultValue: "{}",
        allowNull: false
    }
}, { sequelize, modelName: "UserProgress" });

// Сложные сценарии и вспомогательные функции {
/**
 * Сохраняет прогресс пользователя `user` в игре `game`.
 * @param initiator Пользователь, выполняющий сохранение.
 * @param game Игра, в которой сохраняется прогресс.
 * @param user Пользователь, прогресс которого необходимо сохранить.
 * @param progressData Информация о прогрессе.
 * @returns Объект прогресса.
 */
async function saveProgress(
    initiator: User,
    game: Game,
    user: User,
    progressData: { checkpointsCollected: number, data: string }
): Promise<UserProgress> {
    if (initiator.role == Role.Admin || initiator.id === user.id) {
        if (progressData.checkpointsCollected <= game.checkpointsCount) {
            return await sequelize.transaction(async (transaction) => {
                let progress = await UserProgress.findOne({
                    transaction,
                    where: { gameId: game.id, userId: user.id }
                });
                if (progress === null) {
                    // @ts-ignore
                    progress = await user.createProgress({
                        gameId: game.id,
                        checkpointsCollected: progressData.checkpointsCollected,
                        data: progressData.data
                    })
                }
                else {
                    progress.checkpointsCollected = progressData.checkpointsCollected;
                    progress.data = progress.data;

                    await progress.save();
                }

                return progress;
            });
        }
        else {
            throw new LogicError(
                "Количество собранных чекпоинтов не может превышать максимальное заданное для игры."
            );
        }
    }
    else {
        throw new AccessError(
            "Только администратор сохранять прогресс для другого пользователя."
        );
    }
}

/**
 * Удаляет прогресс `progress`.
 * @param initiator Пользователь, инициирующий удаление.
 * @param progress Объект прогресса.
 */
async function deleteProgress(initiator: User, progress: UserProgress): Promise<void> {
    if (initiator.role === Role.Admin || progress.userId === initiator.id) {
        await progress.destroy();
    }
    else {
        throw new AccessError(
            "Только администратор может удалить прогресс другого пользователя."
        );
    }

    await progress.destroy();
}
// } Сложные сценарии и вспомогательные функции

export default UserProgress;
export { UserProgress, saveProgress, deleteProgress };

