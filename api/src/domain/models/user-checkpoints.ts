/*
 * @file Определение связи между пользователем и чекпоинтом.
 */

import { Model, DataTypes } from "sequelize";

import Checkpoint from "./checkpoint";
import User from "./user";
import sequelize from "../../sequelize";

class UserCheckpoints extends Model { }

UserCheckpoints.init({
    userId: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: "id"
        }
    },
    checkpointId: {
        type: DataTypes.STRING,
        references: {
            model: Checkpoint,
            key: "id"
        }
    }
}, { sequelize, modelName: "UserCheckpoints" });

export default UserCheckpoints;
