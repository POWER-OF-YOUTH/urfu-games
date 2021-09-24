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

export default APIError;