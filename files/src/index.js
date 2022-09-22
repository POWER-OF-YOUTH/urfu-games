import "dotenv/config";

import app from "./app.js";
import * as globals from "./globals.js";

(async function () {
    const hostname = globals.HOSTNAME;
    const port = globals.PORT;
    app.listen(
        port,
        () => console.log(`Server is running on ${hostname}:${port}.`)
    );
}());
