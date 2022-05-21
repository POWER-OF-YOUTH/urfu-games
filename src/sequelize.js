import { Sequelize } from "sequelize";

const databaseURI = process.env.DATABASE_URI ?? "sqlite::memory:";
// const sequelize = new Sequelize(databaseURI);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

export default sequelize;
