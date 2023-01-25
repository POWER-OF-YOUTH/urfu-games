import axios from "axios";

import * as globals from "./globals";

const instance = axios.create({
    baseURL: globals.API_URI,
    headers: {
        "Content-Type": "application/json"
    }
});

instance.interceptors.request.use((config) => {
    // Загружаем `access_token` из локального хранилища
    // перед отправкой очередного запроса.
    config.headers = {
        ...config.headers,
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    };
    return config;
});

export default instance;
