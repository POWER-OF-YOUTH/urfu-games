import APIError from "./api_error";

class LogicError extends APIError {
    constructor(detail = "Ошибка логики.", status: number = 404) {
        super(detail, status);
    }
}

export default LogicError;
