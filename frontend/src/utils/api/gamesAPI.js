import axios from "../../axios";

export async function addGame(data) {
    return axios.post("/games", data);
}

export async function getGame(gameId) {
    return axios.get(`/games/${gameId}`);
}

export async function getGames(start = 0, count = 10, isPublicated) {
    return axios.get("/games", {
        params:{
            start,
            count,
            isPublicated
        }
    });
}
export async function updateGame(gameId, data) {
    return axios.put(`/games/${gameId}`, data);
}

export async function patchGame(gameId, data) {
    return axios.patch(`/games/${gameId}`, data);
}

export async function deleteGame(gameId) {
    return axios.delete(`/games/${gameId}`);
}

export async function rateGame(gameId, value) {
    return axios.post(`/games/${gameId}/ratings`, { value });
}

export async function getUserGames(userId, start = 0, count = 10) {
    return axios.get(`/users/${userId}/games/`, {
        params:{
            start,
            count
        }
    });
}
