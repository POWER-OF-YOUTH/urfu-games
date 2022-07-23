import APIError from "./api_error";

class ValidationError extends APIError {
    public readonly param: string;
    public readonly location: string;

    constructor(param: string, location: string, detail = "Ошибка валидации.") {
        super(detail);

        this.param = param;
        this.location = location;
    }
}

export default ValidationError;
