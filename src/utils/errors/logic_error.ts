import APIError from "./api_error";

class LogicError extends APIError {
    constructor(detail = "Ошибка логики.") {
        super(detail);
    }
}

export default LogicError;
