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

async function check() {
    const url = apiConfig.APIURL + "/auth/check";

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "POST"
    });

    return response;
}

const authAPI = {
    signUp,
    signIn,
    check
};

export default authAPI;
