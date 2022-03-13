import { Model, DataTypes } from "sequelize";

import sequelize from "../../utils/sequelize";

class Progress extends Model { 
    declare id: string;
    declare user: string;
    declare game: string;
    declare checkpointsCollected: number;
    declare data: string;
}

Progress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user: {
        type: DataTypes.UUID
    },
    game: {
        type: DataTypes.UUID
    },
    checkpointsCollected: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    data: {
        type: DataTypes.STRING(1024),
        defaultValue: "{}"
    }
}, { sequelize, modelName: "progress" });

export default Progress;
