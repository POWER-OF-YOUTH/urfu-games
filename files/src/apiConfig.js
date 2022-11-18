import { API_URI } from "./globals.js";
const APIURL = API_URI;

function getDefaultRequestInit(token) {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };
}

export { APIURL, getDefaultRequestInit };
