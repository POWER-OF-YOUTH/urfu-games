export const APIURL = "/api";

export const defaultRequestInit = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
};
