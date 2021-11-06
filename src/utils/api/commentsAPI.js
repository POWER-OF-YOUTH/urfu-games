export async function getComments(gameId) {
    let url = `/api/games/${gameId}/comments`;

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

export async function getComment(gameId, commentId) {
    const url = `/api/games/${gameId}/comments/${commentId}`;

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

export async function addComment(token, gameId, text) {
    const url = `/api/games/${gameId}/comments`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ text }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function updateComment(token, gameId, commentId, text) {
    const url = `/api/games/${gameId}/comments/${commentId}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({ text }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function deleteComment(token, gameId, commentId) {
    const url = `/api/games/${gameId}/comments/${commentId}`;

    try {
        const response = await fetch(url, { 
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}
