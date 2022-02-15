import { CommentDocument } from "../../domain/models/comment";
import { UserDocument } from "../../domain/models/user";
import UserDTO from "./user-dto";

class CommentDetailDTO {
    public readonly id: string;
    public readonly game: string;
    public readonly author: UserDTO;
    public readonly text: string;
    public readonly createdAt: Date;

    constructor(comment: Readonly<CommentDocument>, author: Readonly<UserDocument>) {
        this.id = comment.id;
        this.game = comment.game;
        this.author = new UserDTO(author);
        this.text = comment.text;
        this.createdAt = comment.createdAt;
    }

    static async create(comment: Readonly<CommentDocument>, author?: Readonly<UserDocument>): Promise<CommentDetailDTO> {
        if (author === undefined)
            author = await comment.getAuthor();

        return new CommentDetailDTO(
            comment,
            author
        );
    }
}

export default CommentDetailDTO;
