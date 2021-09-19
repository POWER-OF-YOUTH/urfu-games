import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + "/.env" });

import app from './app';

const port = Number(process.env.PORT || 8000);
const hostname = "localhost";
app.listen(port, hostname, () => {
    console.log(`Server is running on ${hostname}:${port}`);
});