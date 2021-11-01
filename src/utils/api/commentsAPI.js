/**
 * @param {{gameId?: string, author?: string}} options
 */
export async function getComments(options) {
    let url = "/api/comments";
    url += "?" + new URLSearchParams(options);

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

export async function getComment(id) {
    try {
        const response = await fetch(`/api/comments/${id}`, {
            method: "GET"
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function addComment(token, gameId, text) {
    try {
        const response = await fetch("/api/comments", {
            method: "POST",
            body: JSON.stringify({ gameId, text }),
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

export async function updateComment(token, id, text) {
    try {
        const response = await fetch(`/api/comments/${id}`, {
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

export async function deleteComment(token, id) {
    try {
        const response = await fetch(`/api/comments/${id}`, { 
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
