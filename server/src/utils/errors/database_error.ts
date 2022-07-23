import APIError from "./api_error";

class DatabaseError extends APIError {
    constructor(detail = "Ошибка базы данных") {
        super(detail);
    }
}

export default DatabaseError;
