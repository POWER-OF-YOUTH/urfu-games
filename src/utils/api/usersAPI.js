import * as apiConfig from "../../helpers/apiConfig";

export async function getUsers(ids = []) {
    let url = apiConfig.APIURL + "/api/users";
    url += "?" + ids.map(id => `id=${id}`).join("&");

    try {
        const response = await fetch(url, {
            method: "GET"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function getUser(userId) {
    const url = apiConfig.APIURL + `/api/users/${userId}`;

    try {
        const response = await fetch(url, {
            method: "GET"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * @param {string} userId
 * @param {{ name?: string, surname?: string, patronymic?: string, email?: string }} data
 */
export async function updateUser(userId, data = {}) {
    const url = apiConfig.APIURL + `/api/users/${userId}`;

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "PUT",
            body: JSON.stringify(data),
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}
