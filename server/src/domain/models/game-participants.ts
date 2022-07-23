import { Model, DataTypes } from "sequelize";

import Game from "./game";
import User from "./user";
import sequelize from "../../sequelize";

class GameParticipants extends Model { }

enum ParticipantRole {
    Author,
    Participant
}

GameParticipants.init({
    gameId: { 
        type: DataTypes.UUID,
        references: {
            model: Game,
            key: "id"
        },
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize, modelName: "GameParticipants" });

export default GameParticipants;
export { GameParticipants, ParticipantRole };
