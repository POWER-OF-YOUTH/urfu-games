import APIError from "./api_error";

class AuthenticationError extends APIError {
    constructor(instance: string, detail = "Ошибка аутентификации.") {
        super(
            "/errors/authentication-error", 
            "Authentication error.", 
            instance, 
            detail
        );
    }
}

export default AuthenticationError;