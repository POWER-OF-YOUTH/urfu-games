import "dotenv/config";

import mongoose from "mongoose";
import app from "./app";

function checkEnvVariableDefined(name: string) {
    if (process.env[name] === undefined) 
        throw new Error(`You should define \`${name}\` environment variable.`);
}

checkEnvVariableDefined("MONGO_URI");
checkEnvVariableDefined("MONGO_DBN");
checkEnvVariableDefined("JWT_SECRET");
checkEnvVariableDefined("USER_PWD_SALT");

(async function () {
    await mongoose.connect(
        process.env.MONGO_URI, 
        {
            user: process.env.MONGO_USR,
            pass: process.env.MONGO_PWD,
            dbName: process.env.MONGO_DBN
        }
    );

    console.log("Successful connection to database.")

    const port = Number(process.env.PORT ?? 3000);
    const hostname = process.env.HOSTNAME ?? "localhost";

    app.listen(port, hostname, () => {
        console.log(`Server is running on ${hostname}:${port}.`);
    });
}());

