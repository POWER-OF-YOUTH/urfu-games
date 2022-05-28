import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize";

class Comment extends Model { }

Comment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: "Comment" });

export default Comment;
