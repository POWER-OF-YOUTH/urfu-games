/**
 * @file Опеределение модели оценки игры.
 */

import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize";

/** Модель оценки. */
class Rating extends Model {
    /** Уникальный идентификатор оценки. */
    declare id: string;
    /** Числовое значение оценки. */
    declare value: number;
    /** Дата выставления оценки. */
    declare createdAt: Date;
}

Rating.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize, modelName: "Rating" });

export default Rating;
