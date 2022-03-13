import "dotenv/config";

import app from "./app";
import sequelize from "./utils/sequelize";

(async function() {
    await sequelize.authenticate();

    await sequelize.sync();

    app.listen(
        Number(process.env.PORT), 
        "localhost", 
        () => console.log("Server is running on localhost:80")
    );
}());
