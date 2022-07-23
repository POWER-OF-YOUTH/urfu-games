import "dotenv/config";

import app from "./app.js";
import sequelize from "./sequelize.js";

(async function() {
    await sequelize.authenticate();

    await sequelize.sync();

    const port = Number(process.env.PORT ?? 3000);
    const hostname = process.env.HOSTNAME ?? "localhost";
    app.listen(
        port,
        hostname,
        () => console.log(`Server is running on ${hostname}:${port}.`)
    );
}()
    .catch(() => process.exit(1))
);
