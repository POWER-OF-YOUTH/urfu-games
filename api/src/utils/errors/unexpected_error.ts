import APIError from "./api_error";

class UnexpectedError extends APIError {
    constructor(detail = "Непредвиденная ошибка.", status: number = 500) {
        super(detail, status);
    }
}

export default UnexpectedError;
