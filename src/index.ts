import "dotenv/config";

import app from "./app";
import sequelize from "./utils/sequelize";

(async function() {
    await sequelize.authenticate();

    await sequelize.sync();

    app.listen(
        3000, 
        "localhost", 
        () => console.log("Server is running on localhost:80")
    );
}());
