import { Model, DataTypes } from "sequelize";

import Game from "./game";
import Competence from "./competence";
import sequelize from "../../sequelize";

class GameCompetencies extends Model { }

GameCompetencies.init({
    gameId: {
        type: DataTypes.STRING,
        references: {
            model: Game,
            key: "id"
        },
        allowNull: false
    },
    competenceId: {
        type: DataTypes.STRING,
        references: {
            model: Competence,
            key: "id"
        },
        allowNull: false
    }
}, { sequelize, modelName: "GameCompetencies" });

export default GameCompetencies;
