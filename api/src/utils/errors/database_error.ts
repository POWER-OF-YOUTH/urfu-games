import APIError from "./api_error";

class DatabaseError extends APIError {
    constructor(detail = "Ошибка базы данных", status: number = 500) {
        super(detail, status);
    }
}

export default DatabaseError;
