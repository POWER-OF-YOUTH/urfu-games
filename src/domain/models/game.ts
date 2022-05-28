import { Model, DataTypes } from "sequelize";

import User from "./user";
import Comment from "./comment";
import GameParticipants from "./game-participants";
import sequelize from "../../sequelize";
import Rating from "./rating";
import Competence from "./competence";
import GameCompetencies from "./game-competencies";
import Checkpoint from "./checkpoint";

class Game extends Model {
    declare id: string;
    declare image: string;
    declare name: string;
    declare description: string;
    declare loaderUrl: string;
    declare dataUrl: string;
    declare frameworkUrl: string;
    declare codeUrl: string;
    declare isPublicated: string;
    declare createdAt: Date;
}

Game.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
    },
    loaderUrl: {
        type: DataTypes.STRING
    },
    dataUrl: {
        type: DataTypes.STRING
    },
    frameworkUrl: {
        type: DataTypes.STRING
    },
    codeUrl: {
        type: DataTypes.STRING
    },
    idPublicated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
}, { sequelize, modelName: "Game" });

Game.belongsToMany(User, { 
    through: GameParticipants, 
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "participant",
        plural: "participants"
    }
});
User.belongsToMany(Game, { 
    through: GameParticipants, 
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: {
        singular: "game",
        plural: "games"
    } 
});

Game.belongsToMany(Competence, {
    through: GameCompetencies,
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "competence",
        plural: "competencies"
    }
});
Competence.belongsToMany(Game, {
    through: GameCompetencies,
    foreignKey: "competenceId",
    onDelete: "CASCADE",
    as: {
        singular: "game",
        plural: "games"
    }
});

Game.hasMany(Comment, {
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "comment",
        plural: "comments"
    }
});
Comment.belongsTo(Game, {
    as: "game"
});

Game.hasMany(Rating, {
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "rating",
        plural: "ratings"
    }
});
Rating.belongsTo(Game, {
    as: "game"
});

Game.hasMany(Checkpoint, {
    foreignKey: "gameId",
    onDelete: "CASCADE",
    as: {
        singular: "checkpoint",
        plural: "checkpoints"
    }
});
Checkpoint.belongsTo(Game, {
    as: "game"
});

export default Game;
