import "dotenv/config";

import app from "./app.js";
import * as globals from "./globals.js";

(async function () {
    app.listen(
        globals.PORT,
        globals.HOSTNAME,
        () => console.log(`Server is running on ${globals.HOSTNAME}:${globals.PORT}.`)
    );
}());
