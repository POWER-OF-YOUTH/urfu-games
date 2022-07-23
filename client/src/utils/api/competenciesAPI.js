import * as apiConfig from "../../helpers/apiConfig";

/**
 * @param {string} name
 * @param {string} description
 */
export async function createCompetence(name, description) {
    const url = new URL(apiConfig.APIURL + "/competencies");

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "POST",
            body: JSON.stringify({ name, description })
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * @param {number} start
 * @param {number} count
 */
export async function getCompetencies(start, count) {
    const url = new URL(apiConfig.APIURL + "/competencies");
    url.search = new URLSearchParams({ start, count }).toString();

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "GET"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * @param {string} competenceId
 */
export async function getCompetence(competenceId) {
    const url = new URL(apiConfig.APIURL + `/competencies/${competenceId}`);

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "GET"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * @param {string} competenceId
 * @param {{ name?: string, description?: string }} name
 */
export async function updateCompetence(competenceId, data) {
    const url = new URL(apiConfig.APIURL + `/competencies/${competenceId}`);

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "PUT",
            body: JSON.stringify(data)
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * @param {string} competenceId
 */
export async function deleteCompetence(competenceId) {
    const url = new URL(apiConfig.APIURL + `/competencies/${competenceId}`);

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "DELETE",
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}
