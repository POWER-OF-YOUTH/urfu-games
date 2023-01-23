import axios from "../../axios";

export async function getUsers(ids = []) {
    let url = "/users";
    url += "?" + ids.map(id => `id=${id}`).join("&");

    return axios.get(url);
}

export async function getUser(userId) {
    const url = `/users/${userId}`;

    return axios.get(url);
}

/**
 * @param {string} userId
 * @param {{ name?: string, surname?: string, patronymic?: string, email?: string }} data
 */
export async function updateUser(userId, data = {}) {
    const url = `/users/${userId}`;

    return axios.put(url, data);
}

export async function deleteUser(userId) {
    const url = `/users/${userId}`;

    return axios.delete(url);
}
