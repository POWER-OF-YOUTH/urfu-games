abstract class APIError {
    public readonly detail: string;

    constructor(detail: string)
    {
        this.detail = detail;
    }
}

export default APIError;
