import * as apiConfig from "../../helpers/apiConfig";

async function signUp(data) {
    const url = apiConfig.APIURL + "/auth/signup";

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "POST",
        body: JSON.stringify(data)
    });

    return response;
}

async function signIn(data) {
    const url = apiConfig.APIURL + "/auth/signin";

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "POST",
        body: JSON.stringify(data)
    });

    return response;
}

function check() {
    const url = apiConfig.APIURL + "/auth/check";

    return fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "POST"
    });
}

const authAPI = {
    signUp,
    signIn,
    check
};

export default authAPI;
