import APIError from "./api_error";

class ValidationError extends APIError {
    public readonly param: string;
    public readonly location: string;

    constructor(param: string, location: string, detail = "Ошибка валидации.", status: number = 422) {
        super(detail, status);

        this.param = param;
        this.location = location;
    }
}

export default ValidationError;
