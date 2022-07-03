import axios from "axios";

import * as globals from "./globals";

export default axios.create({
    baseURL: globals.API_URI,
    headers: {
        "Authorization": `Bearer ${globals.ACCESS_TOKEN}`,
        "Content-Type": "application/json"
    }
});
