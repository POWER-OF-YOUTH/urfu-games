import * as globals from "../../globals";
import axios from "../../axios";

export async function upload(file) {
    const data = new FormData();
    data.append("file", file);

    return axios.post("/upload", data, { baseURL: globals.FILES_URI });
}

