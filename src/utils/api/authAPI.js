import * as apiConfig from "../../helpers/apiConfig";

async function signUp(data) {
    const url = apiConfig.APIURL + "/auth/signup";

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "POST",
            body: JSON.stringify(data)
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

async function signIn(data) {
    const url = apiConfig.APIURL + "/auth/signin";

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "POST",
            body: JSON.stringify(data)
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

async function check() {
    const url = apiConfig.APIURL + "/auth/check";

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "POST"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

const authAPI = {
    signUp,
    signIn,
    check
};

export default authAPI;
