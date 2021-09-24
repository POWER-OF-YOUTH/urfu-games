import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import mongoose from "mongoose";
import app from "./app";

mongoose.set("useCreateIndex", true);
mongoose.connect(
    <string> process.env.MONGO_URI, 
    {
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        user: process.env.MONGO_USR,
        pass: process.env.MONGO_PWD,
        dbName: process.env.MONGO_DBN
    }
)
    .then(() => console.log("Successful connection to MongoDB!"))
    .catch(err => { throw err; });

const port = Number(process.env.PORT || 8000);
const hostname = "localhost";
app.listen(port, hostname, () => {
    console.log(`Server is running on ${hostname}:${port}`);
});