import APIError from "./api_error";

class AccessError extends APIError {
    constructor(detail = "Ошибка доступа.") {
        super(detail);
    }
}

export default AccessError;
