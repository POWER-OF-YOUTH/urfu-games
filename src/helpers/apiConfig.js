const APIURL = "http://api.urfugames.ru";

function getDefaultRequestInit() {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
    };
}

export { APIURL, getDefaultRequestInit };
