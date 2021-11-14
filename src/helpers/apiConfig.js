export const APIURL = "http://edgime.ru:3000/api";

export function getDefaultRequestInit() {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    };
}
