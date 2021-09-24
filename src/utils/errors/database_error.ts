import APIError from "./api_error";

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

export default DatabaseError;