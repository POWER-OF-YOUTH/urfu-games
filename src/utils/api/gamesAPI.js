/**
 * @param {{ name: string, description?: string, participants?: Array<string>, competencies?: Array<string> }} data
 */
export async function addGame(token, data) {
    const url = "/api/games";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
            
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function getGame(gameId) {
    const url = `/api/games/${gameId}`;

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

export async function getGames() {
    const url = `/api/games`;

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
 * @param {{ name: string, description?: string, participants?: Array<string>, competencies?: Array<string> }} data
 */
export async function updateGame(token, gameId, data) {
    const url = `/api/games/${gameId}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        return response;
    }
    catch (err) {
        console.log(err);
    }
}

export async function deleteGame(token, gameId) {
    const url = `/api/games/${gameId}`;

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
