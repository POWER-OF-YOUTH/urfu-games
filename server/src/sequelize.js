import { Sequelize } from "sequelize";

import { DATABASE_URI } from "./globals";

/**
 * Экземпляр класса `Sequelize`. Его следует использовать
 * при определении моделей и создании транзакций.
 */
const sequelize = new Sequelize(DATABASE_URI);

export default sequelize;
