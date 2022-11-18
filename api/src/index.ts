/**
 * @file Подключение к базе данных и запуск приложения.
 */

import "dotenv/config";

import * as globals from "./globals";
import app from "./app";
import sequelize from "./sequelize";
import { User, Role } from "./domain/models/user";
import { encryptPassword } from "./routes/auth";

(async function() {
    console.log("Connecting to database...");
    await sequelize.sync();
    console.log("Done.")

    let admin = await User.findOne({ where: { login: "admin" }});
    if (admin === null) {
        console.log("Creating admin account...");
        admin = await User.create({
            login: globals.ADMIN_LOGIN,
            email: globals.ADMIN_EMAIL,
            password: encryptPassword(
                globals.ADMIN_PASSWORD,
                globals.USER_PWD_SALT
            ),
            role: Role.Admin,
        });
        console.log("Done.");
    }

    app.listen(
        globals.PORT,
        globals.HOSTNAME,
        () => console.log(`Server is running on ${globals.HOSTNAME}:${globals.PORT}.`)
    );
}());

