import APIError from "./api_error";

class UnexpectedError extends APIError {
    constructor(detail = "Непредвиденная ошибка.") {
        super(detail);
    }
}

export default UnexpectedError;
