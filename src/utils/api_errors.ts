abstract class APIError {
    public readonly type: string;
    public readonly title: string;
    public readonly instance: string;
    public readonly detail: string;

    constructor(type: string, title: string, instance: string, detail: string)
    {
        this.type = type;
        this.title = title;
        this.instance = instance;
        this.detail = detail;
    }
}

class DatabaseError extends APIError {
    constructor(instance: string, detail = "Ошибка базы данных") {
        super(
            "/errors/database-error", 
            "Database error.", 
            instance, 
            detail
        );
    }
}

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

export {
    APIError,
    DatabaseError,
    AuthenticationError,
    ValidationError
};