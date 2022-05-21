import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize.js";

class Checkpoint extends Model { }

Checkpoint.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    competence: {
        type: DataTypes.UUID
    },
    game: {
        type: DataTypes.UUID,
        allowNull: false
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
