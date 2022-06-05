/**
 * @file Подключение к базе данных и запуск приложения
 */

import "dotenv/config";

import sequelize from "./sequelize";
import app from "./app";

/**
 * Функция, которая вызывает исключение, если переменная
 * окружения с именем `name` не определена.
 */
function checkEnvVariableDefined(name: string) {
    if (process.env[name] === undefined)
        throw new Error(`You should define \`${name}\` environment variable.`);
}

checkEnvVariableDefined("JWT_SECRET");
checkEnvVariableDefined("USER_PWD_SALT");
checkEnvVariableDefined("DATABASE_URI");

(async function() {
    await sequelize.sync();

    console.log("Successful connection to database.")

    const port = Number(process.env.PORT ?? 3000);
    const hostname = process.env.HOSTNAME ?? "localhost";

    app.listen(port, hostname, () => {
        console.log(`Server is running on ${hostname}:${port}.`);
    });
}());

