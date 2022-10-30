abstract class APIError {
    public readonly detail: string;
    public readonly status: number;

    constructor(detail: string, status: number)
    {
        this.detail = detail;
        this.status = status;
    }
}

export default APIError;
