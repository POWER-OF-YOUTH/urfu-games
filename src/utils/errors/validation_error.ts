import APIError from "./api_error";

class ValidationError extends APIError {
    public readonly param: string;
    public readonly location: string;

    constructor(instance: string, param: string, location: string, detail = "Ошибка валидации.") {
        super(
            "/errors/validation-error",
            "Validation error.",
            instance,
            detail
        );

        this.param = param;
        this.location = location;
    }
}

export default ValidationError;