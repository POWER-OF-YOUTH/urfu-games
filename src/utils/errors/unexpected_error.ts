import APIError from "./api_error";

class UnexpectedError extends APIError {
    constructor(instance: string, detail = "Непредвиденная ошибка.") {
        super(
            "/errors/unexpected-error", 
            "Unexpected error.", 
            instance, 
            detail
        );
    }
}

export default UnexpectedError;
