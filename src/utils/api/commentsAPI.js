import * as apiConfig from "../../helpers/apiConfig";

export async function getComments(gameId) {
    let url = apiConfig.APIURL + `/games/${gameId}/comments`;

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

export async function getComment(gameId, commentId) {
    const url = apiConfig.APIURL + `/games/${gameId}/comments/${commentId}`;

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

export async function addComment(token, gameId, text) {
    const url = apiConfig.APIURL + `/games/${gameId}/comments`;

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "POST",
            body: JSON.stringify({ text })
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function updateComment(token, gameId, commentId, text) {
    const url = apiConfig.APIURL + `/games/${gameId}/comments/${commentId}`;

    try {
        const response = await fetch(url, {
            ...apiConfig.getDefaultRequestInit(),
            method: "PUT",
            body: JSON.stringify({ text })
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function deleteComment(token, gameId, commentId) {
    const url = apiConfig.APIURL + `/games/${gameId}/comments/${commentId}`;

    try {
        const response = await fetch(url, { 
            ...apiConfig.getDefaultRequestInit(),
            method: "DELETE"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}
