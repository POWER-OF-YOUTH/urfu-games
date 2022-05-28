import { Sequelize } from "sequelize";

const databaseURI = process.env.DATABASE_URI;
const sequelize = new Sequelize(databaseURI);

export default sequelize;
