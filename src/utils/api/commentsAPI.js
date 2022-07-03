import * as apiConfig from "../../helpers/apiConfig";

export async function getComments(gameId) {
    let url = apiConfig.APIURL + `/games/${gameId}/comments`;

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "GET"
    });

    return response;
}

export async function getComment(commentId) {
    const url = apiConfig.APIURL + `/comments/${commentId}`;

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "GET"
    });

    return response;
}

export async function addComment(gameId, text) {
    const url = apiConfig.APIURL + `/games/${gameId}/comments`;

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "POST",
        body: JSON.stringify({ text })
    });

    return response;
}

export async function updateComment(commentId, text) {
    const url = apiConfig.APIURL + `/comments/${commentId}`;

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit(),
        method: "PUT",
        body: JSON.stringify({ text })
    });

    return response;
}

export async function deleteComment(commentId) {
    const url = apiConfig.APIURL + `/comments/${commentId}`;

    const response = await fetch(url, { 
        ...apiConfig.getDefaultRequestInit(),
        method: "DELETE"
    });

    return response;
}
