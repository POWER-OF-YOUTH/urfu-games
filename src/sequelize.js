import { Sequelize } from "sequelize";

const databaseURI = process.env.DATABASE_URI;
/**
 * Экземпляр класса `Sequelize`. Его следует использовать
 * при определении моделей и создании транзакций.
 */
const sequelize = new Sequelize(databaseURI);

export default sequelize;
