class CommentDTO {
    constructor(comment) {
        this.id = comment.id;
        this.author = comment.author;
        this.text = comment.text;
        this.createdAt = comment.createdAt;
    }

    static async create(comment) {
        return new CommentDTO(comment);
    }
}

export default CommentDTO;
