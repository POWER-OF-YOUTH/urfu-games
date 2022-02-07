import { CommentDocument } from "../../domain/models/comment";

class CommentDTO {
    public readonly id: string;
    public readonly author: string;
    public readonly text: string;
    public readonly createdAt: Date;

    constructor(comment: Readonly<CommentDocument>) {
        this.id = comment.id;
        this.author = comment.author;
        this.text = comment.text;
        this.createdAt = comment.createdAt;
    }

    static async create(comment: Readonly<CommentDocument>): Promise<CommentDTO> {
        return new CommentDTO(comment);
    }
}

export default CommentDTO;
