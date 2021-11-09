export const APIURL = "/api";

export function getDefaultRequestInit() {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    };
}
