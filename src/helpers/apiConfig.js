let APIURL = "http://edgime.ru/api";

// Если проект запущен в режиме разработки, используем локальный адрес бэкенда.
if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "development")
    APIURL = "http://edgime.ru:3001/api";

export { APIURL };

export function getDefaultRequestInit() {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
    };
}
