import { Model, DataTypes } from "sequelize";

import sequelize from "../../utils/sequelize";

class Game extends Model {
    declare id: number;
    declare checkpointsCount: number;
}

Game.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    checkpointsCount: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    }
}, { sequelize, modelName: "game" });

export default Game;
