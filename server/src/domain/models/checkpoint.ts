/**
 * @file Определение модели чекпоинта.
 */

import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize";

/** Модель чекпоинта. */
class Checkpoint extends Model {
    declare id: string;
    /** Название чекпоинта. */
    declare name: string;
    /** Описание чекпоинта. */
    declare description: string;
}

Checkpoint.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: "Checkpoint" });

export default Checkpoint;
