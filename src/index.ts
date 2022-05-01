import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";

(async function () {
    await mongoose.connect(
        <string> process.env.MONGO_URI, 
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

