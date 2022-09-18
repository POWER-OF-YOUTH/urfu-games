import UserDTO from "./user-dto";

class CommentDetailDTO {
    constructor(comment, author) {
        this.id = comment.id;
        this.author = new UserDTO(author);
        this.text = comment.text;
        this.createdAt = comment.createdAt;
    }

    static async create(comment) {
        return new CommentDetailDTO(
            comment,
            await comment.getAuthor()
        );
    }
}

export default CommentDetailDTO;
