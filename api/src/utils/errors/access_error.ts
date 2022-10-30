import APIError from "./api_error";

class AccessError extends APIError {
    constructor(detail = "Ошибка доступа.", status: number = 403) {
        super(detail, status);
    }
}

export default AccessError;
