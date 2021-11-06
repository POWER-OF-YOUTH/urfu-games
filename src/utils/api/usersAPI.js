export async function getUsers(ids = []) {
    let url = "/api/users";
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

export async function getUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: "GET"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * @param {string} id
 * @param {{ name?: string, surname?: string, patronymic?: string, email?: string }} data
 */
export async function updateUser(id, data = {}) {
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}
