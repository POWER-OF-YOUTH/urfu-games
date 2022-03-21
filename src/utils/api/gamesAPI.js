import * as apiConfig from "../../helpers/apiConfig";

/**
 * @param {{ 
 *     name: string, 
 *     description?: string, 
 *     participants?: Array<string>, 
 *     competencies?: Array<string> 
 * }} data
 */
export async function addGame(data) {
    const url = apiConfig.APIURL + "/games";

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "POST",
        body: JSON.stringify(data)
        
    });

    return response;
}

export async function getGame(gameId) {
    const url = apiConfig.APIURL + `/games/${gameId}`;

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "GET"
    });

    return response;
}

/**
 * @param {number} start
 * @param {number} count
 */
export async function getGames(start = 0, count = 10) {
    const url = new URL(apiConfig.APIURL + "/games");
    url.search = new URLSearchParams({ start, count }).toString();

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "GET"
    });

    return response;
}

/**
 * @param {{ 
 *     name: string, 
 *     description?: string, 
 *     participants?: Array<string>, 
 *     competencies?: Array<string> 
 * }} data
 */
export async function updateGame(gameId, data) {
    const url = apiConfig.APIURL + `/games/${gameId}`;

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "PUT",
        body: JSON.stringify(data)
    });

    return response;
}

/**
 * @param {string} gameId
 */
export async function deleteGame(gameId) {
    const url = apiConfig.APIURL + `/games/${gameId}`;

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "DELETE",
    });

    return response;
}

/*
 * @param {string} gameId
 * @param {number} value
 */
export async function rateGame(gameId, value) {
    const url = new URL(apiConfig.APIURL + `/games/${gameId}/ratings`);

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "PUT",
        body: JSON.stringify({ value })
    });

    return response;
}
