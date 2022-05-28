import UserDTO from "./user-dto";

class RatingDetailDTO {
    constructor(rating, author) {
        this.id = rating.id;
        this.author = new UserDTO(author);
        this.value = rating.value;
        this.createdAt = rating.createdAt;
    }

    static async create(rating) {
        return new RatingDetailDTO(
            rating,
            await rating.getAuthor()
        );
    }
}

export default RatingDetailDTO;
