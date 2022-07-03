import * as globals from "../globals";

const APIURL = globals.API_URI;

function getDefaultRequestInit() {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
    };
}

export { APIURL, getDefaultRequestInit };
