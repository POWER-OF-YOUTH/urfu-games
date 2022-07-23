import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize.js";

class Progress extends Model { }

Progress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user: {
        type: DataTypes.UUID,
        allowNull: false
    },
    game: {
        type: DataTypes.UUID,
        allowNull: false
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
}, { sequelize, modelName: "Progress" });

export default Progress;
