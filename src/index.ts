/**
 * @file Подключение к базе данных и запуск приложения.
 */

import "dotenv/config";

import sequelize from "./sequelize";
import app from "./app";
import { User, Role } from "./domain/models/user";
import { encryptPassword } from "./routes/auth";

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
checkEnvVariableDefined("ADMIN_PASSWORD");

(async function() {
    console.log("Connecting to database...");

    await sequelize.sync();

    console.log("Done.")

    let admin = await User.findOne({ where: { login: "admin" }});
    if (admin === null) {
        console.log("Creating admin account...");

        admin = await User.create({
            login: "admin",
            email: "admin@urfugames.ru",
            password: encryptPassword(
                process.env.ADMIN_PASSWORD, 
                process.env.USER_PWD_SALT
            ),
            role: Role.Admin,
        });

        console.log("Done.");
    }

    const port = Number(process.env.PORT ?? 3000);
    const hostname = process.env.HOSTNAME ?? "localhost";

    app.listen(port, hostname, () => {
        console.log(`Server is running on ${hostname}:${port}.`);
    });
}());

