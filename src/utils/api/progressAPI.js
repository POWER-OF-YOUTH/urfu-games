import * as apiConfig from "../../helpers/apiConfig";

export async function getProgress(gameId, userId) {
    const url = new URL(apiConfig.APIURL + `/games/${gameId}/progress`);
    url.search = new URLSearchParams({ users: [ userId ]}).toString();

    const response = await fetch(url);

    return response;
}

export async function saveProgress(gameId, userId, data) {
    const url = new URL(apiConfig.APIURL + `/games/${gameId}/progress`);

    const response = fetch(url, { 
        ...apiConfig.getDefaultRequestInit(),
        method: "POST", 
        body: JSON.stringify({ 
            user: userId,  
            data
        }) 
    });

    return response;
}
