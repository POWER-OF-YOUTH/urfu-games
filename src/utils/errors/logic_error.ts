import APIError from "./api_error";

class LogicError extends APIError {
    constructor(
        instance: string, 
        detail = "Ошибка логики. Возможно, вы пытаетесь \
        получить доступ к несуществующему ресурсу.") {
        super(
            "/errors/logic-error", 
            "Logic error.", 
            instance, 
            detail
        );
    }
}

export default LogicError;