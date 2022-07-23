import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize.js";

/*
 * `GameProgressSettings` — сущность, которая описывает настройки
 * сохранения прогресса, например, сколько всего в игре есть
 * чекпоинтов.
 */
class GameProgressSettings extends Model { }

GameProgressSettings.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    game: {
        type: DataTypes.UUID,
        allowNull: false
    },
    checkpointsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
}, { sequelize, modelName: "GameProgressSettings" });

export default GameProgressSettings;


