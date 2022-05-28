import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize";

class Checkpoint extends Model { }

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
