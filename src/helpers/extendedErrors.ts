export class SearchError extends Error{
    public message: string
    constructor(field: string, message: string) {
        super(field);
        this.message = message
    }
}