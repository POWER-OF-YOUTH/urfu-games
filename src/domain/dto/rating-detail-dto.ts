import { RatingDocument } from "../../domain/models/rating";
import { UserDocument } from "../../domain/models/user";
import UserDTO from "./user-dto";

class RatingDetailDTO {
    public readonly id: string;
    public readonly author: UserDTO;
    public readonly value: number;
    public readonly createdAt: Date;

    constructor(rating: Readonly<RatingDocument>, author: Readonly<UserDocument>) {
        this.id = rating.id;
        this.author = new UserDTO(author);
        this.value = rating.value;
        this.createdAt = rating.createdAt;
    }

    static async create(rating: Readonly<RatingDocument>, author?: Readonly<UserDocument>): Promise<RatingDetailDTO> {
        if (author === undefined)
            author = await rating.getAuthor();

        return new RatingDetailDTO(
            rating,
            author
        );
    }
}

export default RatingDetailDTO;
