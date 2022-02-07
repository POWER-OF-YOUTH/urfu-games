import { RatingDocument } from "../../domain/models/rating";

class RatingDTO {
    public readonly id: string;
    public readonly author: string;
    public readonly value: number;
    public readonly createdAt: Date;

    constructor(rating: Readonly<RatingDocument>) {
        this.id = rating.id;
        this.author = rating.author;
        this.value = rating.value;
        this.createdAt = rating.createdAt;
    }

    static async create(rating: Readonly<RatingDocument>): Promise<RatingDTO> {
        return new RatingDTO(rating);
    }
}

export default RatingDTO;
