import axios from "axios";

import * as globals from "../src/globals.js";

export default axios.create({
    baseURL: globals.API_URI,
    headers: {
        "Content-Type": "application/json"
    }
});

