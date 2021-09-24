import APIError from "./api_error";

class AccessError extends APIError {
    constructor(instance: string, detail = "Ошибка доступа.") {
        super(
            "/errors/access-error", 
            "Access error.", 
            instance, 
            detail
        );
    }
}

export default AccessError;