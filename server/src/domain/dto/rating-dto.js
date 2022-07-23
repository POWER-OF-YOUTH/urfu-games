class RatingDTO {
    constructor(rating) {
        this.id = rating.id;
        this.author = rating.author;
        this.value = rating.value;
        this.createdAt = rating.createdAt;
    }

    static async create(rating) {
        return new RatingDTO(rating);
    }
}

export default RatingDTO;
