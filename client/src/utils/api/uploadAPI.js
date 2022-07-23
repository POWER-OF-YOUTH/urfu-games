import * as apiConfig from "../../helpers/apiConfig";

export async function upload(file) {
    const url = new URL("https://api.urfugames.ru/upload");
    const data = new FormData();
    data.append("file", file);

    return fetch(url, {
        method: "POST",
        body: data,
    });
}

