import * as apiConfig from "./apiConfig.js";
import fetch from "node-fetch";

async function check(token) {
    const url = apiConfig.APIURL + "/auth/check";

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(token),
        method: "POST"
    });

    return response;
}

const authAPI = {
    check
};

export default authAPI;
