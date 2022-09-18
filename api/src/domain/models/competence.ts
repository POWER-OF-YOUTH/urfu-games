import { Model, DataTypes } from "sequelize";

import Checkpoint from "./checkpoint";
import sequelize from "../../sequelize";

class Competence extends Model { }

Competence.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: "Competence" });

Competence.hasMany(Checkpoint, {
    foreignKey: "competenceId",
    onDelete: "SET NULL",
    as: {
        singular: "checkpoint",
        plural: "checkpoints"
    }
});
Checkpoint.belongsTo(Competence, {
    as: "competence"
});

export default Competence;
