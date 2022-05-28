import { Model, DataTypes } from "sequelize";

import sequelize from "../../sequelize";

class Rating extends Model { }

Rating.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize, modelName: "Rating" });

export default Rating;
