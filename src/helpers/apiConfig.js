const APIURL = "http://10.0.0.1:3004";

function getDefaultRequestInit() {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
    };
}

export { APIURL, getDefaultRequestInit };
